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
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  //----------------------------------------------------------------- main ---
  /**
   * DOMContentLoaded loaded !
   */
  window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    // static node
    const toggler = document.querySelector("#toggler");
    const first_togglable = document.querySelector(".togglable-case");

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
        if (event.defaultPrevented || event.repeat) {
          return; // Do nothing if the event was already processed
        }
        //   if (!e.repeat) {
        //     console.log("not a repeat hit")
        // }

        const keyName = event.key;
        console.log(`${keyName} was pressed`);

        switch (keyName) {
          case "y":
          case "Y":
            combo[0] = 1;
            console.log(`${keyName} combo was pressed`);
            break;
          case "a":
          case "A":
            combo[1] = 1;
            console.log(`${keyName} combo was pressed`);
            break;
          case "s":
          case "S":
            combo[2] = 1;
            console.log(`${keyName} combo was pressed`);
            break;
          default:
            break;
        }

        switch (combo.reduce(reducer)) {
          case 3:
            first_togglable.classList.add("toggle-color");
          case 2:
            first_togglable.classList.remove("hidden");
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
    document.addEventListener(
      "keyup",
      (event) => {
        if (event.defaultPrevented || event.repeat) {
          return; // Do nothing if the event was already processed
        }
        //   if (!e.repeat) {
        //     console.log("not a repeat hit")
        // }

        const keyName = event.key;
        console.log(`${keyName} was released`);

        switch (keyName) {
          case "y":
          case "Y":
            combo[0] = 0;
            console.log(`${keyName} combo was released`);
            break;
          case "a":
          case "A":
            combo[1] = 0;
            console.log(`${keyName} combo was released`);
            break;
          case "s":
          case "S":
            combo[2] = 0;
            console.log(`${keyName} combo was released`);
            break;
          default:
            break;
        }

        switch (combo.reduce(reducer)) {
          case 1:
          case 0:
            first_togglable.classList.add("hidden");
            break;
          case 2:
            first_togglable.classList.remove("toggle-color");
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
