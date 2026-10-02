# Multi-stage build so the final image doesn't carry the Maven toolchain.
# Uses the Maven Docker image directly rather than assuming a checked-in
# Maven wrapper (mvnw) exists — generate one locally with `mvn -N wrapper:wrapper`
# if you'd rather pin the exact Maven version; not required for this to work.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
