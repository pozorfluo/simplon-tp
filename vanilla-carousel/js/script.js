(function () {
  "use strict";

  function getRandomLock() {
    return Math.floor(Math.random() * 100000).toString();
  }

  function preloadImages(images) {
    const preloaded_images = [];

    for (let i = 0; i < images.length; i++) {
      console.log(`preloading img : ${images[i]}`);
      const image = new Image();
      image.onload = function () {
        // toss image when done loading
        let index = preloaded_images.indexOf(this);
        if (index !== -1) {
          preloaded_images.splice(index, 1);
        }
        console.log(`done preloading img : ${images[i]}`);
      };
      preloaded_images.push(image);
      image.src = images[i];
    }
  }
  /**
   * Generate and then cycle forward or backward through own random placeholder
   * image array of given length, image width, image height
   *
   * Go forward with .next().value
   * Go backward with .next('previous').value
   *
   * https://loremflickr.com/320/240?lock=30976
   *
   */
  function* cyclePlaceHolder(length, width, height) {
    const placeholders = [];
    // generate random list of loremflickr.com url
    for (let i = 0; i < length; i++) {
      const url = `https://loremflickr.com/${width}/${height}/dog/?lock=${getRandomLock()}`;
      placeholders.push(url);
    }

    // preload images
    preloadImages(placeholders);
    // const fragment = document.createDocumentFragment();
    // for (let i = 0; i < length; i++) {
    //   const link = document.createElement("link");
    //   link.setAttribute("rel", "preload");
    //   link.setAttribute("href", placeholders[i]);
    //   link.setAttribute("as", "image");
    //   fragment.appendChild(link);
    // }
    // document.body.appendChild(fragment);

    for (let i = 0; ; ) {
      if (i >= length) {
        i = 0;
      } else if (i < 0) {
        i = length - 1;
      }
      const previous_or_next = (yield placeholders[i]) == "previous" ? -1 : 1;
      i += previous_or_next;
    }
  }

  function testAlert(msg = "hello, hello, hello") {
    alert(msg);
  }

  function squareClick(event, color) {
    // testAlert()
    /**
     * todo
     *   - [ ] Investigate this vs event.target vs event.currentTarget further
     */
    // this.style.backgroundColor = getRandomColorHex();
    event.currentTarget.style.backgroundColor = color;
    let child_span = event.currentTarget.querySelector("span");
    // console.log(child_span);
    child_span.innerText = color;
  }

  //------------------------------------------------------------------- main ---
  /**
   * DOMContentLoaded loaded !
   */
  window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    // setup carousel
    const carousel = document.querySelector(".carousel");
    const width = carousel.offsetWidth;
    const height = carousel.offsetWidth;
    const length = 3;
    const placeholder_cycler = cyclePlaceHolder(length, width, height);

    console.log(`carousel width = ${width}`);
    console.log(`carousel height = ${height}`);
    carousel.style.backgroundImage = `url(${placeholder_cycler.next().value})`;

    console.log("forward");
    for (let i = 0; i < 6; i++) {
      console.log(placeholder_cycler.next().value);
    }
    console.log("backward");
    for (let i = 0; i < 6; i++) {
      console.log(placeholder_cycler.next("previous").value);
    }

    //setup carousel controls
    const previous_buttons = [...carousel.querySelectorAll(".previous")];
    const next_buttons = [...carousel.querySelectorAll(".next")];

    if (previous_buttons == null || next_buttons == null) {
      console.log("error : carousel not set up properly in .html document.");
    }

    //------------------------------------------- previous_buttons click
    for (let i = 0, length = previous_buttons.length; i < length; i++) {
      previous_buttons[i].addEventListener(
        "click",
        function (event) {
          carousel.style.backgroundImage = `url(${
            placeholder_cycler.next("previous").value
          })`;
          //   console.log(carousel.style.backgroundImage);
        },
        false
      );
    }
    //------------------------------------------- next_buttons click
    for (let i = 0, length = next_buttons.length; i < length; i++) {
      next_buttons[i].addEventListener(
        "click",
        function (event) {
          carousel.style.backgroundImage = `url(${
            placeholder_cycler.next().value
          })`;
          //   console.log(carousel.style.backgroundImage);
        },
        false
      );
    }

    //--------------------------------------------------- carousel hover
    carousel.addEventListener(
      "mouseover",
      function (event) {
        for (let i = 0, length = previous_buttons.length; i < length; i++) {
          previous_buttons[i].classList.add("toggle-opacity");
        }
        for (let i = 0, length = next_buttons.length; i < length; i++) {
          next_buttons[i].classList.add("toggle-opacity");
        }
      },
      false
    );
    carousel.addEventListener(
      "mouseleave",
      function (event) {
        for (let i = 0, length = previous_buttons.length; i < length; i++) {
          previous_buttons[i].classList.remove("toggle-opacity");
        }
        for (let i = 0, length = next_buttons.length; i < length; i++) {
          next_buttons[i].classList.remove("toggle-opacity");
        }
      },
      false
    );
  });
})();
