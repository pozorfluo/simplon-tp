(function () {
  "use strict";

  function testAlert(msg = "hello, hello, hello") {
    alert(msg);
  }

  //   function allPressed(flagArray){
  //       let predicate = true;
  //       let length = flagArray.length;
  //       for (let i=0; i<length; i++){
  //         predicate &= flagArray[i];
  //       }
  //       return predicate;
  //   }

  // used as a ghetto popcount with combo
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  //----------------------------------------------------------------- main ---
  /**
   * DOMContentLoaded loaded !
   */
  window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    // static node
    const toggler = document.querySelector("#toggler");
    const togglable = document.querySelector(".togglable-case");
    // const bg = document.querySelector(".money-bg");

    // combo flag-ish
    let combo = [0, 0, 0];

    //---------------------------------------------------- toggler click
    toggler.addEventListener(
      "click",
      function (event) {
        // testAlert();
        console.log(`does toggler click bubble ? ${event.bubbles}`);
        event.target.innerText = "press YAS";
        document.body.classList.add("bg-gray");

        event.stopPropagation();
      },
      false
    );

    //------------------------------------------------------- body click
    // toggler.parentNode.parentNode.addEventListener(
    document.body.addEventListener(
      "click",
      function (event) {
        // testAlert();
        console.log(`does body click bubble ? ${event.bubbles}`);
        event.currentTarget.classList.remove("bg-gray");
      },
      false
    );

    //-------------------------------------------------- combo key press
    document.addEventListener(
      "keydown",
      (event) => {
        event.preventDefault();
        if (event.repeat) {
          return; // Do nothing if the event was already processed
        }

        const keyName = event.key;
        console.log(`${keyName} was pressed`);

        switch (keyName) {
          case "y":
          case "Y":
            combo[0] = 1;
            break;
          case "a":
          case "A":
            combo[1] = 1;
            break;
          case "s":
          case "S":
            combo[2] = 1;
            break;
          default:
            return;
        }

        console.log(`${keyName} combo was pressed`);

        switch (combo.reduce(reducer)) {
          case 3:
            togglable.classList.add("toggle-color");
          // bg.classList.add("toggle-color-bg");
          case 2:
            togglable.classList.remove("hidden");
            //fallthrough
            break;
          default:
            break;
        }
        // if (allPressed(combo)) {
        //   first_togglable.classList.remove("hidden");
        // }
      },
      false
    );
    //------------------------------------------------ combo key release
    document.addEventListener(
      "keyup",
      (event) => {
        if (event.defaultPrevented || event.repeat) {
          return; // Do nothing if the event was already processed
        }

        const keyName = event.key;
        console.log(`${keyName} was released`);

        switch (keyName) {
          case "y":
          case "Y":
            combo[0] = 0;
            break;
          case "a":
          case "A":
            combo[1] = 0;
            break;
          case "s":
          case "S":
            combo[2] = 0;
            break;
          default:
            return;
        }
        console.log(`${keyName} combo was released`);

        switch (combo.reduce(reducer)) {
          case 1:
          case 0:
            togglable.classList.add("hidden");
            break;
          case 2:
            togglable.classList.remove("toggle-color");
          // bg.classList.remove("toggle-color-bg");
          //fallthrough
          default:
            break;
        }
        // if (!allPressed(combo)) {
        //   first_togglable.classList.add("hidden");
        // }
      },
      false
    );
  });
})();
