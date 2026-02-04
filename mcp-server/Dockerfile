# Base image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Copy only dependency files first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on
EXPOSE 8000

# Default command to run the app (can be overridden in docker-compose)
CMD ["python", "-u", "main.py"]

