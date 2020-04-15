(function () {
  "use strict";

  function getRandomColorHex(span = 16, offset = 0) {
    offset = Math.max(Math.min(16, offset), 0);
    span = Math.max(Math.min(16 - offset, span), 0);
    return "#000000".replace(/0/g, function () {
      return (~~(Math.random() * span) + offset).toString(16);
    });
  }

  /**
   * Generate and then cycle through own random color array of given length
   */
  function* cycleColor(length) {
    const color_list = [];
    for (let i = 0; i < length; i++) {
      color_list.push(getRandomColorHex());
      // console.log(color_list[i]);
    }

    for (let i = 0; ; i++) {
      yield color_list[i % length];
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

    const colorCycler = cycleColor(5);

    for (var i = 0, length = squares.length; i < length; i++) {
      console.log(squares[i].nodeName);
      console.log(i);
      squares[i].style.backgroundColor = colorCycler.next().value;
      //   for(let i = 0; i<25; i++) {
      //       console.log(colorCycler.next().value);
      //   }

      //------------------------------------------------------------ click
      squares[i].addEventListener(
        "click",
        function (event) {
          squareClick(event, colorCycler.next().value);
        },
        false
      );

      //------------------------------------------------------------ hover
      squares[i].addEventListener(
        "mouseover",
        function (event) {
          //   squareClick(event, colorCycler.next().value);
          event.currentTarget.style.boxShadow =
            "5px 5px 5px rgba(0, 0, 0, 0.5)";
        },
        false
      );
      squares[i].addEventListener(
        "mouseleave",
        function (event) {
          event.currentTarget.style.boxShadow = "0px 0px 0px rgba(0, 0, 0, 0)";
          squareClick(event, colorCycler.next().value);
        },
        false
      );
    }
  });
})();
