# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# คัดลอกไฟล์ package เพื่อลง dependencies ก่อน (ช่วยเรื่อง Layer Caching)
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดและ Build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# คัดลอกเฉพาะไฟล์ที่จำเป็นจาก Stage builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# เปิด Port (ปกติ NestJS คือ 3000)
CMD ["node", "dist/main"]