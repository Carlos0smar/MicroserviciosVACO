FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o auth-service .

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

ENV TZ=America/Mexico_City

WORKDIR /app

COPY --from=builder /app/auth-service .

COPY --from=builder /app/.env.example /app/.env

EXPOSE 8080
 
CMD ["./auth-service"]
