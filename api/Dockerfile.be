# Use the official Python base image
FROM python:3.9-slim

# Install Git and Supervisor
RUN apt-get update && apt-get install -y git supervisor

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
COPY upload upload
COPY .flaskenv .


# Configure Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the Flask application port
EXPOSE 5050

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]