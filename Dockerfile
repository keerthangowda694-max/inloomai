# ----------------------------------------------------
# Stage 1: Build Frontend (Vite + React + Three.js)
# ----------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ----------------------------------------------------
# Stage 2: Build Backend with Integrated Frontend
# ----------------------------------------------------
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend

# Copy backend pom and resolve dependencies
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy backend source
COPY backend/src ./src

# Copy built frontend assets into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Package executable fat jar
RUN mvn clean package -DskipTests -B

# ----------------------------------------------------
# Stage 3: Lightweight Production JRE Runtime
# ----------------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S inkloom && adduser -S inkloom -G inkloom
USER inkloom

COPY --from=backend-builder /app/backend/target/inkloom-backend-1.0.0-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
