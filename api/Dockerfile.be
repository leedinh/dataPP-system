# Use the official Python base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Create and activate the virtual environment
RUN python -m venv venv
ENV PATH="/app/venv/bin:$PATH"

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask application code to the container
COPY run.py .
COPY flask_app flask_app
COPY anonymizer anonymizer


# Set the FLASK_APP environment variable
ENV FLASK_APP=app.py

# Expose the Flask application port
EXPOSE 5050

# # Start the Flask application
CMD ["python3", "run.py"]
