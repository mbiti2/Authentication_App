# 🧱 Build stage
FROM rust:1.82-slim AS builder
WORKDIR /app

# Install build tools
RUN apt-get update && apt-get install -y curl pkg-config libssl-dev build-essential ca-certificates

# Copy full project
COPY . .

# Build release
RUN cargo build --release

# 🏃 Runtime stage
FROM debian:bookworm-slim
WORKDIR /app

# Only install minimal runtime deps
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy built binary from builder stage (make sure to match stage name)
COPY --from=builder /app/target/release/auth_api /app/auth_api

EXPOSE 3000
CMD ["./auth_api"]