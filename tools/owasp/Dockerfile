# Dockerfile for building the OWASP ZAP image used by the OWASP ZAP scan job in the pipeline.
# This image is already available in the OpenShift imagestream and does not need to be rebuilt unless changes are necessary.
# The OWASP ZAP scan job is triggered by Argo CD after the application's deployment is complete and will use the image from the imagestream to run the scan.
# Only modify this file and rebuild the image if updates to the image are required.

# Use the official OWASP ZAP stable image as the base
FROM zaproxy/zap-stable:latest

# Switch to root user for permission changes
USER root

# Set permissions for /zap and /home/zap directories
RUN chown -R zap:zap /zap && \
    chmod -R 777 /zap && \
    chmod -R 777 /home/zap

# Set /zap as the working directory
WORKDIR /zap

# Switch back to the zap user
USER zap
