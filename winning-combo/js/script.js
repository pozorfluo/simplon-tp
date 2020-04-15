(function () {
  "use strict";

  function testAlert(msg = "hello, hello, hello") {
    alert(msg);
  }

  function allPressed(flagArray){
      let predicate = true;
      let length = flagArray.length;
      for (let i=0; i<length; i++){
        predicate &= flagArray[i];
      }
      return predicate;
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

    // combo flag-ish
    let combo = [false, false, false];

    //---------------------------------------------------- toggler click
    toggler.addEventListener(
      "click",
      function (event) {
        // testAlert();
        console.log(`does toggler click bubble ? ${event.bubbles}`);
        event.target.innerText = "press YAS"
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
            combo[0] = true;
            console.log(`${keyName} combo was pressed`);
            break;
          case "a":
          case "A":
            combo[1] = true;
            console.log(`${keyName} combo was pressed`);
            break;
          case "s":
          case "S":
            combo[2] = true;
            console.log(`${keyName} combo was pressed`);
            break;
          default:
            break;
        }
                
        if (allPressed(combo)) {
            first_togglable.classList.remove("hidden");
        }
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
            combo[0] = false;
            console.log(`${keyName} combo was released`);
            break;
          case "a":
          case "A":
            combo[1] = false;
            console.log(`${keyName} combo was released`);
            break;
          case "s":
          case "S":
            combo[2] = false;
            console.log(`${keyName} combo was released`);
            break;
          default:
            break;
        }
        
        if (!(allPressed(combo))) {
            first_togglable.classList.add("hidden");
        }
      },
      false
    );
  });
})();
