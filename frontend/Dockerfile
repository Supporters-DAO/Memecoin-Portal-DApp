FROM node:18-alpine
MAINTAINER gear

WORKDIR /frontend

COPY . .

ARG NEXT_PUBLIC_NODE_ADDRESS
ARG NEXT_PUBLIC_CONTRACT_ADDRESS
ARG NEXT_PUBLIC_EXPLORER
ENV NEXT_PUBLIC_NODE_ADDRESS=${NEXT_PUBLIC_NODE_ADDRESS}
ENV NEXT_PUBLIC_CONTRACT_ADDRESS=${NEXT_PUBLIC_CONTRACT_ADDRESS}
ENV NEXT_PUBLIC_EXPLORER=${NEXT_PUBLIC_EXPLORER}
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Install necessary packages
RUN apk update && \
    apk add xsel && \
    yarn install && \
    yarn build && \
    npm install --global serve

CMD ["serve", "-s", "/frontend/apps/vara-man/build"]