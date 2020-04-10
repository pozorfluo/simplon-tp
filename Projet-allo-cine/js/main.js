(function () {
  "use strict";

  /**
   * Plumbing test
   */
  function changeInput(domElement, input) {
    domElement.textContent = input ? `Hello, ${input}!` : "...";
  }

   /**
   * window loaded !
   */
  window.onload = (event) => {
    const domElement = document.getElementById("output");
    const input = document.getElementById("input");

    input.addEventListener(
      "input",
      function () {
        changeInput(domElement, input.value);
      },
      false
    );

    //-------------------------------------------- initial json plumbing ---
    let request_url =
      "https://pozorfluo.github.io/simplon-tp/Projet-allo-cine/data/moovies.json";

    let request = new XMLHttpRequest();

    request.open('GET', request_url);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
        const movies = request.response;
        // const movie_count = movies.length;
        changeInput(domElement, movies[0].Title);

        for (const [index, movie] of movies.entries()) {
            console.log(movie.Title);
        }
    }
      
  };
})();
