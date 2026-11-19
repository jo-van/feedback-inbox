FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates bash && rm -rf /var/lib/apt/lists/*
ARG CLAUDE_VERSION=latest
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_VERSION} && npm cache clean --force
USER node
ENV HOME=/home/node
WORKDIR /work
