# Base image for all stages
FROM node:20-slim AS base

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack for package management
RUN corepack enable

# Set working directory
WORKDIR /app

# COPY package.json and pnpm-lock.yaml files

COPY package.json pnpm-lock.yaml ./

# Copy the entire project into the image
COPY . .



# ----------------------------------------
# Stage: Install Production Dependencies
# ----------------------------------------
FROM base AS prod-deps

# Install production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# ----------------------------------------
# Stage: Build Application
# ----------------------------------------
FROM base AS build

# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the application
RUN pnpm run build

# ----------------------------------------
# Stage: Production Image
# ----------------------------------------
FROM base AS production

# Copy built application and production dependencies from previous stages
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production


# Expose the port on which the app runs
EXPOSE 3000

# Command to start the application
CMD [ "pnpm", "start:prod" ]