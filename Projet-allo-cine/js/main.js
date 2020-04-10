(function () {
  "use strict";

  function displayCards(section, movies) {
    const movie_count = movies.length;

    // for (const [index, movie] of movies.entries()) {
    for (let i = 0; i < movie_count; i++) {
      console.log(movies[i].Title);

      const card = document.createElement("div");
      card.className = "card mx-auto";
      card.setAttribute("style", "height: 400px;");

      const img = document.createElement("div");
      //   img.setAttribute("src", movies[i].Images[0]);
      //     img.setAttribute("height", "100px");
      //   img.setAttribute("width", "auto");
      //   img.setAttribute("alt", movies[i].Title);
      img.className = "center-cropped";
      img.setAttribute(
        "style",
        `background-image: url('${movies[i].Images[0]}');`
      );
      //   img.className = "h-100 w-25";
      //     <div class="card mx-auto">
      //     <div class="row">
      //       <div class="col-sm">
      //         <img
      //           src="movie.Images[0]"
      //           class="card-img-top"
      //           alt="movie illustration image"
      //         />
      //       </div>
      //       <div class="col-sm">
      //         <div class="card-body">
      //           <h5 class="card-title">movie.Title</h5>
      //           <p class="card-text">
      //             movie.Plot
      //           </p>
      //           <div class="list-group">
      //             <a href="#" class="list-group-item list-group-item-action">
      //               Metascore : movie.Metascore
      //             </a>
      //             <a href="#" class="list-group-item list-group-item-action">
      //               imdb.com  : movie.imdbRating
      //             </a>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      card.appendChild(img);
      section.appendChild(card);
    }
  }

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
    // const domElement = document.getElementById("output");
    // const input = document.getElementById("input");
    const section = document.getElementById("card-section");

    // input.addEventListener(
    //   "input",
    //   function () {
    //     changeInput(domElement, input.value);
    //   },
    //   false
    // );

    //-------------------------------------------- initial json plumbing ---
    let request_url =
      //   "https://pozorfluo.github.io/simplon-tp/Projet-allo-cine/data/moovies.json";
      "data/moovies.json";

    let request = new XMLHttpRequest();

    request.open("GET", request_url);
    request.responseType = "json";
    request.send();

    request.onload = function () {
      const movies = request.response;
      // const movie_count = movies.length;
      // changeInput(domElement, movies[0].Title);

      displayCards(section, movies);
    };
  };
})();
