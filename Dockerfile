FROM oven/bun AS builder

# Set production environment vars
ENV NODE_ENV="production"
WORKDIR /home/bun/app

# Copy the project files
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile --ignore-scripts --production

# Stage 2: Create the final distroless image
FROM oven/bun:distroless

# Copy the compiled standalone file from the builder stage
COPY --from=builder /home/bun/app/ /

ENV NODE_ENV="production"

# Set the entrypoint to the compiled standalone file
EXPOSE 3000
ENTRYPOINT ["bun"]
CMD ["/src/index.ts"]