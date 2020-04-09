#!/bin/bash

# mostly a playground file


# ex1
TITLE="title ex1"
cd ex1

# setup basic project structure
mkdir www && cd www
mkdir html
mkdir css
mkdir js
touch index.html
touch js/script.js
touch css/style.css

cat <<MINIMAL_HTML > index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>$TITLE</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
  </head>
  <body>
    <!-- page content -->
  </body>
</html>
MINIMAL_HTML