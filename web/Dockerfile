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

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn

RUN npm install gulp -g

RUN curl -s https://storage.googleapis.com/golang/go1.9.linux-amd64.tar.gz | tar -v -C /usr/local -xz
ENV PATH "$PATH:/usr/local/go/bin"
ENV GOPATH /go
RUN mkdir -p /go/bin
ENV PATH "PATH=$PATH:$GOPATH/bin"

WORKDIR /go/src/bitbucket.org/fanky5g/xxxinafrica/web
RUN curl https://glide.sh/get | sh
RUN /bin/bash -c "echo '127.0.0.1       admin.localhost' >> /etc/hosts"