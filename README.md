Open sourcing a closed project. Was supposed to be a job board that crawls and indexes other job boards in Ghana but went to a dead end. Use as you please :)

[Install golang:](https://golang.org/doc/install) by following your architecture instructions.
**Make sure to setup GOPATH. You'll find notes on the same page**

[Install docker](https://docs.docker.com/engine/installation/), a container management tool for building microservices based containerized applications.
[Install docker-compose](https://docs.docker.com/compose/install/)

Run: **go get -u github.com/fanky5g/jobsghana**

#Change directory to jobsghana:
Run: cd $GOPATH/github.com/fanky5g/jobsghana
Run: make

Run: **docker-compose up**
 This downloads multiple docker containers on first run so might take a while.
Subsequent runs:
  - To run web client: **docker-compose up nginx web**
  - To run image server: **docker-compose up nginx imageserver**

<!-- docker ps -q -a -f status=exited | xargs -n 100 docker rm -v -->
<!-- docker images -q --filter "dangling=true" | xargs -n 100 docker rmi -->
<!-- docker run -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/docker:/var/lib/docker --rm martin/docker-cleanup-volumes -->
