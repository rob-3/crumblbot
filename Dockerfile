FROM public.ecr.aws/lambda/nodejs:latest

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package*.json .

RUN npm ci

# Copy function code
COPY app.js .

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]
