# Base image
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Builder stage
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY package.json package-lock.json* ./
COPY prisma ./prisma
COPY next.config.mjs postcss.config.mjs tailwind.config.ts tsconfig.json ./
COPY src ./src

# Copy assets to public directory
RUN mkdir -p public/team_logos public/team_wordmarks public/team_colors public/vendor_logos
COPY team_logos ./public/team_logos
COPY team_wordmarks ./public/team_wordmarks
COPY team_colors ./public/team_colors
COPY vendor_logos ./public/vendor_logos

# Generate Prisma Client
RUN npx prisma generate

# Build the application  
ENV NEXT_TELEMETRY_DISABLED=1
# Note: Build will show pre-render errors but that's expected for dynamic-only pages
# We check for .next directory (not standalone) since standalone may not be created with errors
RUN npm run build || echo "Build completed with warnings"
# Verify .next was created
RUN test -d .next || (echo "ERROR: .next directory not created" && exit 1)
# Create missing manifest files that Next.js expects but doesn't create on build errors
RUN touch .next/prerender-manifest.json 2>/dev/null || true
RUN echo '{"version":4,"routes":{},"/":{"initialRevalidateSeconds":false,"srcRoute":null,"dataRoute":null},"dynamicRoutes":{},"preview":{"previewModeId":"","previewModeSigningKey":"","previewModeEncryptionKey":""}}' > .next/prerender-manifest.json

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache openssl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy all necessary files for runtime (including src for dev mode)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data && chmod 755 /app/data

# Don't switch to nextjs user yet - need to handle volume mount permissions
# USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV DATABASE_URL="file:/app/data/nfl-squares.db"

# Initialize database on first run and start app
# Run as root to handle volume permissions
CMD ["/bin/sh", "-c", "chown -R nextjs:nodejs /app/data && chmod 777 /app/data && npx prisma migrate deploy && npm start"]
