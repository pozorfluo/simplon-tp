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

# may or may not be useful
    export DOCKER_HOST=127.0.0.1
    # see https://gist.github.com/styblope/dc55e0ad2a9848f2cc3307d4819d819f
    service --status-all
    # change MySQL Port in devilbox .env file
    HOST_PORT_MYSQL=33060
    # see https://deliciousbrains.com/devilbox-local-wordpress-development-docker/

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

# say hello to php
cd ~/devilbox/data/www
mkdir hello-php/htdocs

# add to C:\Windows\System32\drivers\etc\hosts
127.0.0.1 hello-php.loc

# configure vs code for php debug and devilbox
# see https://devilbox.readthedocs.io/en/latest/intermediate/configure-php-xdebug/toolbox/vscode.html
# see also creating a .devcontainer/devcontainer.json file

# install php7.0
sudo apt-get install php7.0
# The following NEW packages will be installed:
#   apache2 apache2-bin apache2-data apache2-utils libapache2-mod-php7.0 libapr1 libaprutil1 libaprutil1-dbd-sqlite3 libaprutil1-ldap liblua5.2-0 php-common php7.0
#   php7.0-cli php7.0-common php7.0-json php7.0-opcache php7.0-readline psmisc ssl-cert


# setup basic index.php
cat <<MINIMAL_HTML > index.php
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$TITLE</title>
    <link rel="stylesheet" href="css/style.css" />
    <script src="js/script.js"></script>
  </head>
  <body>
    $CONTENT
  </body>
</html>
MINIMAL_HTML