FROM node:22.13.1-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Node rather than nginx: `/api/signup-intent` runs on demand. The pages are
# still prerendered and served as static files by the same process.
FROM node:22.13.1-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=80
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 80
CMD ["node", "dist/server/entry.mjs"]
