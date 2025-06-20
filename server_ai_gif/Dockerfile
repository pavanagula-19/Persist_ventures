# Use Eclipse Temurin JDK 17 as the base image for Spring Boot
FROM eclipse-temurin:17-jdk

# Install system dependencies: ffmpeg, Python, pip, venv
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python3-venv curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements.txt first (to leverage Docker layer caching)
COPY requirements.txt .

# Upgrade pip and install Python dependencies from requirements.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --retries 10 --timeout 100 -r requirements.txt

# Copy Spring Boot JAR
COPY target/server_ai_gif-0.0.1-SNAPSHOT.jar app.jar

# Copy optional Python scripts (if any)
COPY scripts/ /scripts/

# Expose default port
EXPOSE 8080

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
