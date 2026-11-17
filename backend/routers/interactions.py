"""Drug–drug interaction checking for the POS.

Flags Major interactions between the active ingredients (salt / generic_name)
of the medicines in a sale. Dataset: a compact generic-name adjacency map
derived from DDInter (see backend/data/drug_interactions.json), Major level.
This is a clinical decision-support aid, not a substitute for a pharmacist's
judgement.
"""
import json
import os
import re
from typing import List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth import get_current_user

router = APIRouter(prefix="/api/interactions", tags=["interactions"])

_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "drug_interactions.json")


def _load():
    try:
        with open(_DATA_PATH, encoding="utf-8") as f:
            raw = json.load(f)
    except (OSError, ValueError):
        return {}, set(), []
    adj = {k: set(v) for k, v in raw.get("interactions", {}).items()}
    known = set(adj.keys())
    multi = sorted((n for n in known if " " in n), key=len, reverse=True)
    return adj, known, multi


_ADJ, _KNOWN, _MULTI = _load()
_SINGLE = {n for n in _KNOWN if " " not in n}

# The dataset uses US/INN spellings; Pakistani pharmacists often use British or
# common names. Map those to the canonical name used in the dataset.
_SYNONYMS = {
    "paracetamol": "acetaminophen",
    "aspirin": "acetylsalicylic acid",
    "asa": "acetylsalicylic acid",
    "frusemide": "furosemide",
    "lignocaine": "lidocaine",
    "adrenaline": "epinephrine",
    "noradrenaline": "norepinephrine",
    "albuterol": "salbutamol",
    "gtn": "nitroglycerin",
    "glyceryl trinitrate": "nitroglycerin",
    "phenobarbitone": "phenobarbital",
    "ciclosporin": "cyclosporine",
    "amoxycillin": "amoxicillin",
    "rifampin": "rifampicin",
    "oestrogen": "estradiol",
    "ethinyloestradiol": "ethinylestradiol",
}
_SYNONYMS = {k: v for k, v in _SYNONYMS.items() if v in _KNOWN}
_SYN_SINGLE = {k: v for k, v in _SYNONYMS.items() if " " not in k}
_SYN_MULTI = {k: v for k, v in _SYNONYMS.items() if " " in k}


def _norm(s: Optional[str]) -> str:
    return re.sub(r"\s+", " ", (s or "").strip().lower())


def _ingredients(text: str) -> List[str]:
    """Known active ingredients mentioned in a free-text name/generic string."""
    t = _norm(text)
    if not t:
        return []
    found = set()
    for tok in set(re.findall(r"[a-z][a-z\-]+", t)):
        if tok in _SINGLE:
            found.add(tok)
        elif tok in _SYN_SINGLE:
            found.add(_SYN_SINGLE[tok])
    for name in _MULTI:
        if name in t:
            found.add(name)
    for syn, canon in _SYN_MULTI.items():
        if syn in t:
            found.add(canon)
    return sorted(found)


class ItemIn(BaseModel):
    product_id: Optional[int] = None
    name: Optional[str] = None
    generic_name: Optional[str] = None


class CheckIn(BaseModel):
    items: List[ItemIn]


@router.post("/check")
def check_interactions(data: CheckIn, _=Depends(get_current_user)):
    # Resolve each cart line to its active ingredients (prefer generic_name).
    resolved = []
    for it in data.items:
        ings = _ingredients(it.generic_name or "") or _ingredients(it.name or "")
        resolved.append({"label": (it.name or it.generic_name or "Item"), "ingredients": ings})

    warnings = []
    seen = set()
    for i in range(len(resolved)):
        for j in range(i + 1, len(resolved)):
            a, b = resolved[i], resolved[j]
            for da in a["ingredients"]:
                for db in b["ingredients"]:
                    if da == db:
                        continue
                    if db in _ADJ.get(da, ()):  # major interaction
                        key = tuple(sorted((da, db))) + (i, j)
                        if key in seen:
                            continue
                        seen.add(key)
                        warnings.append({
                            "severity": "major",
                            "product_a": a["label"], "product_b": b["label"],
                            "drug_a": da.title(), "drug_b": db.title(),
                            "message": (f"Major interaction: {da.title()} + {db.title()}. "
                                        "Review before dispensing."),
                        })
    recognized = sum(1 for r in resolved if r["ingredients"])
    return {
        "warnings": warnings,
        "has_major": any(w["severity"] == "major" for w in warnings),
        "checked": len(resolved),
        "recognized": recognized,
        "dataset_loaded": bool(_KNOWN),
    }
