# Step 1: Use a Java runtime as the base
FROM eclipse-temurin:17-jdk-alpine

# Step 2: Create a directory for the app
WORKDIR /app

# Step 3: Copy your compiled .jar file into the container
# Note: Run './mvnw package' first to generate this file in the /target folder
COPY target/*.jar app.jar

# Step 4: Tell Docker to run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
