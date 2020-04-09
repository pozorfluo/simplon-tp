#!/bin/bash

# mostly a playground file

# say hello to docker
# ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 --containerd=/run/containerd/containerd.sock
sudo nohup docker daemon -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
# sudo service docker start
# sudo service docker restart
# sudo dockerd
# docker run hello-world
# docker image ls

# say hello to devilbox
git clone https://github.com/cytopia/devilbox
cd devilbox
cp env-example .env
id -u && id -g
docker-compose up

# enter the php container ------------------------------------------------------
cd devilbox
./shell.sh

# create a new vhost directory
mkdir my-wp

# git clone wordpress
cd my-wp
git clone https://github.com/WordPress/WordPress wordpress.git
tree -L 1

# symlink webroot
ln -s wordpress.git/ htdocs
tree -L 1

# add mysql database
mysql -u root -h 127.0.0.1 -p -e 'CREATE DATABASE my_wp;'

# configure dns
sudo nano /etc/hosts