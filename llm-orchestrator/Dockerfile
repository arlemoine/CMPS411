# Development Dockerfile for LLM Orchestrator (Python)
# Supports hot-reloading for local development

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy only dependency files first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the orchestrator will run on
EXPOSE 8080

# Default command to run the app
# TODO: Update this once Adam sets up the actual entry point
CMD ["python", "-u", "main.py"]
