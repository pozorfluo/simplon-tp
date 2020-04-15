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
    const toggler = document.querySelector("#toggler");
    const first_togglable = document.querySelector(".togglable-case");
    // const body = document.querySelector("body");
    // console.log(document.body);

    //---------------------------------------------------- toggler click
    toggler.addEventListener(
      "click",
      function (event) {
        // testAlert();
        console.log(`does toggler click bubble ? ${event.bubbles}`);
        first_togglable.classList.toggle("hidden");
        document.body.classList.add("bg-gray");
        event.stopPropagation();
      },
      false
    );

    //------------------------------------------------------- body click
    document.body.addEventListener(
      "click",
      function (event) {
        // testAlert();
        console.log(`does body click bubble ? ${event.bubbles}`);
        first_togglable.classList.add("hidden");
        document.body.classList.remove("bg-gray");
      },
      false
    );
  });
})();
