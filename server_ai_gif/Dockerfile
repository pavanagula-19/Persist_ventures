FROM eclipse-temurin:17-jdk

Install ffmpeg and python3
RUN apt-get update &&
apt-get install -y ffmpeg python3 python3-pip &&
apt-get clean

Copy Spring Boot JAR (make sure this name matches your built file)
COPY target/server_ai_gif-0.0.1-SNAPSHOT.jar app.jar

Copy any Python scripts (if present)
COPY scripts/ /scripts/

Install required Python packages
RUN pip3 install openai-whisper sentence-transformers torch

Set working directory
WORKDIR /

Expose the Spring Boot port
EXPOSE 8080

Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]