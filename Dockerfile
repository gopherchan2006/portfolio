FROM node:22-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_BASE_PATH=/
RUN npm run build

FROM golang:1.25-alpine AS backend-builder
WORKDIR /backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/server ./cmd/server

FROM alpine:3.21
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app \
    && apk add --no-cache ca-certificates
COPY --from=backend-builder /out/server /app/server
COPY --from=backend-builder /backend/migrations /app/migrations
COPY --from=frontend-builder /frontend/dist /app/static
RUN mkdir -p /app/storage && chown -R app:app /app
USER app
ENV PORT=8080 \
    MIGRATIONS_DIR=/app/migrations \
    STORAGE_DIR=/app/storage \
    STATIC_DIR=/app/static
EXPOSE 8080
CMD ["/app/server"]
