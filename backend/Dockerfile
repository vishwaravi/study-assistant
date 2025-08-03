# --- Stage 1: Build with Maven ---
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /build

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# --- Stage 2: Run on minimal JRE ---
FROM eclipse-temurin:21.0.7_6-jre-ubi9-minimal

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

ENTRYPOINT [ "java", "-jar", "app.jar" ]
