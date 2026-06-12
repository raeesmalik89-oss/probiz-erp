FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
ARG CACHEBUST=1
ENV REACT_APP_API_URL=https://probiz-erp-production.up.railway.app
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build ./build
EXPOSE 3000
CMD serve -s build -l 3000
