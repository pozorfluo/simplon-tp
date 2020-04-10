(function () {
  "use strict";

  /**
   * Plumbing test
   */
  function changeInput(domElement, input) {

    domElement.textContent = input ? `Hello, ${input}!` : "...";
  }

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
  };
})();
