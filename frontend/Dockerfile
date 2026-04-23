FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD sh -c "printf 'VITE_API_URL=%s\n' \"${VITE_API_URL:-http://localhost:8080}\" > .env && npm run dev -- --host"
