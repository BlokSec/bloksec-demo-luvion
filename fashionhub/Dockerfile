FROM node:alpine
EXPOSE 8080
LABEL Author="Mike Gillan <mgillan@bloksec.com>"
# RUN apk add --update \
#   git \
#   python \
#   python-dev \
#   py-pip \
#   build-base
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm install --production
CMD ["npm", "start"]
