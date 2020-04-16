(function () {
  "use strict";

  function getRandomColorHex(span = 16, offset = 0) {
    offset = Math.max(Math.min(16, offset), 0);
    span = Math.max(Math.min(16 - offset, span), 0);
    return "#000000".replace(/0/g, function () {
      //   return (~~(Math.random() * span) + offset).toString(16);
      return (Math.floor(Math.random() * span) + offset).toString(16);
    });
  }

  /**
   * Generate and then cycle through own random color array of given length
   */
  function* cycleColor(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(getRandomColorHex(16, 12));
      // console.log(colors[i]);
    }

    // fails when i > Number.MAX_SAFE_INTEGER
    //
    // for (let i = 0; ; i++) {
    //   yield colors[i % length];
    // }

    for (let i = 0; ; i++) {
      yield colors[i >= length ? (i = 0) : i];
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

    // static node array
    const squares = [...document.querySelectorAll(".square")];
    const square_container = document.querySelector(".square-container");
    const color_cycler = cycleColor(9);
    square_container.style.backgroundColor = color_cycler.next().value;
    
    for (let i = 0, length = squares.length; i < length; i++) {
      console.log(squares[i].nodeName);
      console.log(i);
      squares[i].style.backgroundColor = color_cycler.next().value;

      //------------------------------------------------------------ click
      squares[i].addEventListener(
        "click",
        function (event) {
          squareClick(event, color_cycler.next().value);
        },
        false
      );

      //------------------------------------------------------------ hover
      squares[i].addEventListener(
        "mouseover",
        function (event) {
          const color = event.currentTarget.style.backgroundColor;
          square_container.style.backgroundColor = color;
        },
        false
      );
      squares[i].addEventListener(
        "mouseleave",
        function (event) {
          squareClick(event, color_cycler.next().value);
        },
        false
      );
    }
  });
})();
