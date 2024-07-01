FROM oven/bun AS builder

# Set production environment vars
ENV NODE_ENV="production"
WORKDIR /home/bun/app

# Copy the project files
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile --ignore-scripts --production

# Build the project
RUN bun run build:prod

# Stage 2: Create the final distroless image
FROM oven/bun:distroless

# Copy the compiled standalone file from the builder stage
COPY --from=builder  --chown=nonroot:nonroot /home/bun/app/node_modules /home/nonroot/app/node_modules
COPY --from=builder --chown=nonroot:nonroot /home/bun/app/dist /home/nonroot/app/dist

ENV NODE_ENV="production"

USER nonroot

# Set the entrypoint to the compiled standalone file
EXPOSE 3000
ENTRYPOINT ["bun"]
CMD ["/home/nonroot/app/dist/index.js"]