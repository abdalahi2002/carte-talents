# Base image
FROM node:20-alpine AS base

# Build stage
FROM base AS builder
WORKDIR /app

# Build arguments for environment variables
ARG NEXT_PUBLIC_SUPABASE_URL_AB
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY_AB

# Set them as environment variables for the build
ENV NEXT_PUBLIC_SUPABASE_URL_AB=$NEXT_PUBLIC_SUPABASE_URL_AB
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY_AB=$NEXT_PUBLIC_SUPABASE_ANON_KEY_AB

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --force

# Copy all other files and build the project
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /next-app

# Create non-root user and switch to it
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next

# Set the command to start the application
CMD ["npm", "start"]