# ---------- Builder Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate


# ---------- Production Stage ----------
FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# app source
COPY package*.json ./
COPY src ./src

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENV NODE_ENV=production

CMD ["/entrypoint.sh"]