FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o habitacion-service .

FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

ENV TZ=America/Mexico_City

WORKDIR /app

COPY --from=builder /app/habitacion-service .

EXPOSE 8080
 
CMD ["./habitacion-service"]
