# development stage
FROM node:18-alpine AS development
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

# production stage
FROM node:18-alpine AS production
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
COPY --from=build /usr/src/app/dist ./dist
RUN npm install -g pnpm
RUN pnpm install -P
RUN rm package*.json pnpm-lock.yaml 
EXPOSE 3000
CMD ["node", "dist/main.js"]