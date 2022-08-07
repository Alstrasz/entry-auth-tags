FROM node:16
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build:local
ENV HOST=0.0.0.0
EXPOSE 3000

CMD npm start