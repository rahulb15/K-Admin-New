ARG NODE_VERSION=20.16.0
ARG ALPINE_VERSION=3.20

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS node

FROM alpine:${ALPINE_VERSION} AS build-env

COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

RUN node -v

#FROM alpine:3.18 AS build-env

# Set the working directory in the container
WORKDIR /usr/src/kryptomerchadmin

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# RUN npm install -g npm@latest
# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set environment variables
ENV REACT_APP_API_URL=http://localhost:5000/api/v1
ENV REACT_APP_PROJECT_ID=2689f9f5492dde9108b277171b024cfd
ENV REACT_APP_RELAY_URL=wss://relay.walletconnect.com
ENV REACT_APP_KDA_NETWORK_TYPE=testnet
ENV REACT_APP_KDA_CHAIN_ID=1
ENV REACT_APP_KDA_GAS_PRICE=0.0000001
ENV REACT_APP_KDA_GAS_LIMIT=100000
ENV REACT_APP_KDA_PRECISION=12
ENV REACT_APP_KDA_NETWORK_ID=testnet04
ENV REACT_APP_KDA_FEE=0.003
ENV REACT_APP_APR_FEE=0.0025
ENV REACT_APP_KDA_NETWORK=https://api.testnet.chainweb.com
ENV REACT_APP_BASE_URL=http://localhost:5000/api/v1/
ENV REACT_APP_ZELCORE_URL=http://127.0.0.1:9467/v1/accounts
ENV REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51OeAJVHJ5f4oRHZQGywXAZpVMJsCpgmsIfYFf2XezhXn0Wtx5prHYJjDhTXYxdFv1pGY72uG8wgBcs5yV12708kL00G69kwITz



# Build the React app
RUN npm run build

COPY . .


FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

# Install dependencies
 RUN npm install -g npm@latest

# Install serve
RUN npm install -g serve

# Copy build files from builder stage
COPY --from=build-env /usr/src/kryptomerchadmin/build /usr/src/kryptomerchadmin/build

# Command to run the app
CMD ["serve", "-s", "/usr/src/kryptomerchadmin/build", "-l", "tcp://0.0.0.0:3000"]

# Expose the desired port
EXPOSE 3000
