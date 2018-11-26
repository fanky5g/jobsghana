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

RUN curl -s https://storage.googleapis.com/golang/go1.9.linux-amd64.tar.gz | tar -v -C /usr/local -xz
ENV PATH "$PATH:/usr/local/go/bin"
ENV GOPATH /go
RUN mkdir -p /go/bin
ENV PATH "PATH=$PATH:$GOPATH/bin"

ADD . /go/src/github.com/fanky5g/xxxinafrica/crawler
WORKDIR /go/src/github.com/fanky5g/xxxinafrica/crawler

RUN /bin/bash -c "go install"

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/crawl

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/crawl

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

#Install Cron
RUN apt-get -y install cron