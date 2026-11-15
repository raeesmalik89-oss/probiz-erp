FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY . .
ARG REACT_APP_API_URL=https://probiz-erp-production.up.railway.app
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
