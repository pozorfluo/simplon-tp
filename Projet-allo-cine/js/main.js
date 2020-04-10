(function () {
  "use strict";

  function buildCards(movies) {
    const movie_count = movies.length;
    const section = document.createElement("div");
    section.id = "card-section";

    for (let i = 0; i < movie_count; i++) {
      console.log(movies[i].Title);

      //     <div class="card mx-auto">
      const card = document.createElement("div");
      card.className = "card mx-auto";
      card.setAttribute("style", "height: 400px;");

      //     <div class="row">
      const row = document.createElement("div");
      row.className = "row";

      //       <div class="col-sm">
      const col_img = document.createElement("div");
      col_img.className = "col-sm";

      //         <img />
      const img = document.createElement("div");
      img.className = "center-cropped";
      img.setAttribute(
        "style",
        `background-image: url('${movies[i].Images[0]}');`
      );


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
    return section;
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
    const section = document.getElementById("main-section");

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

      section.appendChild(buildCards(movies));
    };
  };
})();
