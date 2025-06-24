# Runtime stage
FROM debian:bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the binary
COPY --from=builder /app/target/release/auth_api /app/auth_api

# ✅ Copy the .env file
COPY .env /app/.env

EXPOSE 3000
CMD ["./auth_api"]
