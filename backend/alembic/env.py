"""Alembic environment — wired to the app's own settings and models.

The database URL comes from the application config (DATABASE_URL), not from
alembic.ini, so migrations always target the same database the app uses and
you never duplicate credentials. The managed-Postgres driver fix mirrors
database.py so `postgres://` / `postgresql://` URLs resolve to psycopg2.
"""
import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Make the backend package importable (env.py runs from backend/alembic/).
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import settings  # noqa: E402
import models  # noqa: E402  (registers all tables on Base.metadata)
from database import Base  # noqa: E402

config = context.config

# Point Alembic at the application's database, with the same driver fix-up
# database.py applies for managed Postgres providers (Render/Railway/Heroku).
_db_url = settings.DATABASE_URL
if _db_url.startswith("postgres://"):
    _db_url = _db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif _db_url.startswith("postgresql://"):
    _db_url = _db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
config.set_main_option("sqlalchemy.url", _db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without a live DB connection (emits SQL)."""
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations against a live DB connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=connection.dialect.name == "sqlite",
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
