FROM eclipse-temurin:17-jdk

Install ffmpeg and python3
RUN apt-get update &&
apt-get install -y ffmpeg python3 python3-pip &&
apt-get clean

Copy Spring Boot JAR (make sure the name matches your target file)
COPY target/server_ai_gif-0.0.1-SNAPSHOT.jar app.jar

Copy Python scripts (optional — remove if you don’t use Python)
COPY scripts/ /scripts/

Install Python dependencies
RUN pip3 install openai-whisper sentence-transformers torch

Set working directory
WORKDIR /

Expose port 8080
EXPOSE 8080

Run the Spring Boot JAR
ENTRYPOINT ["java", "-jar", "app.jar"]