# Use Eclipse Temurin JDK 17 as the base image for Spring Boot
FROM eclipse-temurin:17-jdk

# Install ffmpeg, Python 3, pip, and venv support
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python3-venv && \
    apt-get clean

# Create a Python virtual environment to avoid breaking system packages
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Upgrade pip and install Python dependencies inside venv
RUN pip install --upgrade pip && \
    pip install openai-whisper sentence-transformers torch

# Set the working directory
WORKDIR /app

# Copy Spring Boot JAR (update filename if needed)
COPY target/server_ai_gif-0.0.1-SNAPSHOT.jar app.jar

# Copy any Python scripts (optional, only if you use them in backend)
COPY scripts/ /scripts/

# Expose port 8080 (default Spring Boot port)
EXPOSE 8080

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
