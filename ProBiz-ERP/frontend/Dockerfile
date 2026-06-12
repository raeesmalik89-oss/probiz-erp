FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
ENV REACT_APP_API_URL=https://probiz-erp-production.up.railway.app
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD sh -c "serve -s build -l ${PORT:-3000}"
