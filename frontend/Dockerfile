FROM node:18-alpine
MAINTAINER gear

WORKDIR /frontend

# Copy package.json, yarn.lock, .yarnrc.yml, and .yarn/releases
COPY . .

# Set environment variables
ARG VITE_NODE_ADDRESS
ARG VITE_CONTRACT_ADDRESS
ARG VITE_SENTRY_DSN
ENV VITE_NODE_ADDRESS=${VITE_NODE_ADDRESS} \
    VITE_CONTRACT_ADDRESS=${VITE_CONTRACT_ADDRESS} \
    VITE_SENTRY_DSN=${VITE_SENTRY_DSN} \
    DISABLE_ESLINT_PLUGIN=true

# Install necessary packages
RUN apk update && \
    apk add xsel && \
    yarn install && \
    yarn build && \
    npm install --global serve

CMD ["serve", "-s", "/frontend/apps/vara-man/build"]
