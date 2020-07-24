FROM node:14
WORKDIR /root/webapp

COPY package.json yarn.lock ./
RUN yarn

COPY src/ src/
ENV NODE_ENV production
