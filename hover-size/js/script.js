(function () {
  "use strict";

  function testAlert(msg = "hello, hello, hello") {
    alert(msg);
  }

  //----------------------------------------------------------------- main ---
  /**
   * DOMContentLoaded loaded !
   */
  window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    // static node
    const squares = [...document.querySelectorAll(".square")];

    for (var i = 0, length = squares.length; i < length; i++) {
      //---------------------------------------------- squares mouseover
    //   squares[i].addEventListener(
    //     "mouseover",
    //     function (event) {
    //       //   testAlert();
    //       const square = event.currentTarget;
    //       if (square.hasChildNodes()) {
    //         const children = [...event.currentTarget.childNodes];
    //         for (var j = 0, length = children.length; j < length; j++) {
    //           children[j].classList.add("toggle-p");
    //         }
    //       }
    //     },
    //     false
    //   );
      //--------------------------------------------- squares mouseleave
    //   squares[i].addEventListener(
    //     "mouseleave",
    //     function (event) {
    //       //   testAlert();
    //       const square = event.currentTarget;
    //       if (square.hasChildNodes()) {
    //         const children = [...event.currentTarget.childNodes];
    //         for (var j = 0, length = children.length; j < length; j++) {
    //           children[j].classList.remove("toggle-p");
    //         }
    //       }
    //     },
    //     false
    //   );
      //---------------------------------------------- squares mousedown
      squares[i].addEventListener(
        "mousedown",
        function (event) {
          //   testAlert();
          const square = event.currentTarget;
          if (square.hasChildNodes()) {
            const children = [...event.currentTarget.childNodes];
            for (var j = 0, length = children.length; j < length; j++) {
              children[j].classList.add("toggle-color");
            //   children[j].classList.toggle("toggle-p");
            }
          }
        },
        false
      );

      //------------------------------------------------ squares mouseup
      squares[i].addEventListener(
        "mouseup",
        function (event) {
          //   testAlert();
          const square = event.currentTarget;
          if (square.hasChildNodes()) {
            const children = [...event.currentTarget.childNodes];
            for (var j = 0, length = children.length; j < length; j++) {
              children[j].classList.remove("toggle-color");
            //   children[j].classList.toggle("toggle-p");
            }
          }
        },
        false
      );
    }
  });
})();
