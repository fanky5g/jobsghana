FROM ubuntu:latest

RUN apt-get update
RUN apt-get -qq update

RUN apt-get update && apt-get install --no-install-recommends -y \
    ca-certificates \
    curl \
    mercurial \
    git-core \
    build-essential \
    apt-transport-https \
    ca-certificates

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
#RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD . /app/imageserver
WORKDIR /app/imageserver

RUN npm install