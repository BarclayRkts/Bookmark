# --- Stage 1: Build the application ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the project and skip tests to save time
RUN mvn clean package -DskipTests

# --- Stage 2: Run the application ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copy ONLY the finished .jar from the build stage
COPY --from=build /app/target/*.jar app.jar
# Expose the port
EXPOSE 8080
# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]