# Base stage with Node.js, build-essential, Python, git, and necessary libraries
FROM node:18-bullseye-slim as base

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    build-essential \
    python3 \
    git \
    libssl-dev \
    libc6-dev \
    libudev-dev && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

# Install Truffle and Ganache CLI
RUN npm install -g truffle ganache-cli

# Configure Git to ignore SSL certificate verification
RUN git config --global http.sslVerify false

# Truffle stage
FROM base as truffle

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json yarn.lock /home/app/

RUN yarn install

COPY truffle-config.js /home/app/
COPY contracts /home/app/contracts/
COPY migrations /home/app/migrations/
COPY test /home/app/test/

CMD ["truffle", "version"]

# Ganache stage
FROM base as ganache

RUN mkdir -p /home
WORKDIR /home
EXPOSE 8545

ENTRYPOINT ["ganache-cli", "--host", "0.0.0.0"]