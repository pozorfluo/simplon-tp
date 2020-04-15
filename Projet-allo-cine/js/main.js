(function () {
  "use strict";

  function buildCards(movies) {
    const movie_count = movies.length;
    const section = document.createElement("div");
    section.id = "card-section";

    //---------------------------------------------------------- movie cards
    for (let i = 0; i < movie_count; i++) {
      console.log(movies[i].Title);

      // <div class="card mx-auto">
      const card = document.createElement("div");
      card.className = "card mx-auto my-3 movie-card";
      //   card.setAttribute("style", "height: 400px; max-width: 60%");

      // <div class="row">
      const row = document.createElement("div");
      row.className = "row";
      card.appendChild(row);

      // <div class="col-?">
      const col_img = document.createElement("div");
      col_img.className = "col-12 col-sm-4";
      row.appendChild(col_img);

      // movie poster
      const poster_link = document.createElement("a");
      poster_link.setAttribute(
        "href",
        `https://www.imdb.com/find?q=${movies[i].Title}`
      );
      poster_link.setAttribute("target", "_blank");

      const poster = document.createElement("img");
      poster.className = "movie-poster";
      poster.setAttribute("src", movies[i].Poster);
      poster.setAttribute("alt", movies[i].Title);
      poster_link.appendChild(poster);
      col_img.appendChild(poster_link);

      // <div class="col-?">
      const col_desc = document.createElement("div");
      col_desc.className = "col-12 col-sm-8";
      row.appendChild(col_desc);

      // <div class="card-body">
      const card_body = document.createElement("div");
      card_body.className = "card-body";
      col_desc.appendChild(card_body);

      // movie title
      // <h5 class="card-title"> movie.Title </h5>
      const movie_title = document.createElement("h5");
      movie_title.className = "card-title text-center movie-title";
      movie_title.textContent = movies[i].Title;
      card_body.appendChild(movie_title);

      // movie plot
      // <p class="card-text"> movie.Plot </p>
      const movie_plot = document.createElement("p");
      movie_plot.className = "card-text movie-plot";
      movie_plot.textContent = movies[i].Plot;
      card_body.appendChild(movie_plot);

      // movie rating
      const movie_rating = document.createElement("span");
      movie_rating.className = "card-text  movie-rating";
      movie_rating.textContent = movies[i].imdbRating;
      card_body.appendChild(movie_rating);

      //----------------------------------------------- movie thumbnails
      // <div class="list-group">
      const thumb_list = document.createElement("div");
      thumb_list.className = "thumb-list text-center";

      const img_count = movies[i].Images.length;

      for (let j = 0; j < img_count; j++) {
        // <a href="#" class="list-group-item list-group-item-action">
        const thumb_a = document.createElement("a");
        thumb_a.className =
          "thumb-listitem";
          thumb_a.setAttribute(
          "href",
          movies[i].Images[j]
        );
        thumb_a.setAttribute("target", "_blank");

        // <img />
        const img = document.createElement("div");
        img.className = "movie-thumb";
        img.setAttribute(
          "style",
          `background-image: url('${movies[i].Images[j]}');`
        );
        thumb_a.appendChild(img);
        thumb_list.appendChild(thumb_a);
      }
      col_desc.appendChild(thumb_list);

      section.appendChild(card);
    }

    return section;
  }

  /**
   * window loaded !
   */
  window.onload = (event) => {
    // const statArrFromSpread =  [...document.querySelectorAll('a')];
    const section = document.getElementById("main-section");

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
      section.appendChild(buildCards(movies));
      /**
       * BAD JUJU 
       *    section.innerHTML += movies[0].Title;
       * 
       * try it yourself :
       *    "Title": "<img src='x' onerror='alert(1)'>",
       */ 
    };
  };
})();
