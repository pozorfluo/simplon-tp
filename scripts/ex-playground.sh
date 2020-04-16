#!/bin/bash

# mostly a playground file


# ex1
TITLE="title ex1"
cd ex1


# ex2
cd ../ex2
unzip articles.zip

TITLE="title ex2"

CONTENT=$(cat <<CONTENT_HTML
<header>
    <nav>
        <h1>header title</h1>
        <ul>
            <li><a href="#">header nav</a></li>
            <li><a href="#">header nav</a></li>
            <li><a href="#">header nav</a></li>
        </ul>
    </nav>
</header>

<main role=”main”>
    <article>
        <header>
            <h2>article title</h2>
            <p>tagline</p>
            <a><img src="" /></a>
        </header>
        <p>article body</p>
    </article>

    <aside>
        <details>
            <summary>article extra</summary>
            <ul>
                <li><a href="#">extras</a></li>
                <li><a href="#">extras</a></li>
            </ul>
        </details>
    </aside>
</main>

<footer>
    <h2>footer title</h2>
        <ul>
            <li><a href="#">footer link</a></li>
            <li><a href="#">footer link</a></li>
            <li><a href="#">footer link</a></li>
        </ul>
    <address>
        <a href="mailto:mail@example.com">contact</a>
    </address>
</footer>
CONTENT_HTML
)
echo "$CONTENT"

# setup basic project structure
mkdir www && cd www
mkdir html
mkdir css
mkdir js
mkdir images
touch index.html
touch js/script.js
touch css/style.css

cat <<MINIMAL_HTML > index.html
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