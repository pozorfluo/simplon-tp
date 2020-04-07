#!/bin/bash

# mostly a playground file

# say hello to docker
docker run hello-world
docker image ls
sudo service docker start
sudo nohup docker daemon -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
sudo dockerd

# say hello to devilbox
git clone https://github.com/cytopia/devilbox
cd devilbox
cp env-example .env
id -u && id -g
docker-compose up