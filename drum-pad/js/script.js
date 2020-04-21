(function () {
  "use strict";

  /**
   * Play audio node for given key code in given pad dictionnary
   * Animate corresponding pad
   * Add eventListener to reset the pad when done
   *
   * note
   *   Enforce upper case upstream before calling this function since a
   *   dictionnary is case sensitive and the value from event.key could be
   *   either case.
   */
  function playSound(pad_dict, key_code) {
    const [audio, pad] = pad_dict[key_code];

    /* if not running play, else reset audio */
    if (audio.paused) {
        audio.play();
    } else {
        audio.currentTime = 0;
    }

    pad.classList.add("playing");

    pad.addEventListener("transitionend", function (event) {
      // console.log(`pad ${key_code} : transition done`);
      removeTransition(this);
    });
  }

  /**
   * Reset a pad style
   */
  function removeTransition(pad_node) {
    pad_node.classList.remove("playing");
  }

  /**
   * Build a fragment containing all the pads for a given audio sources array
   *    -> pads fragment
   */
  function buildPads(audio_src_array) {
    const pads = document.createDocumentFragment();

    for (let i = 0, length = audio_src_array.length; i < length; i++) {
      let wav = audio_src_array[i].getAttribute("src");
      /* dirty way to get the leaf name */
      wav = wav.slice(wav.lastIndexOf("/") + 1, wav.lastIndexOf("."));
      //   console.log(wav);

      //--------------------------------------------- div .key
      const key = document.createElement("div");
      key.classList.add("key");
      if ("key" in audio_src_array[i].dataset) {
        // console.log(audio_sources[i].dataset['key']);
        const key_code = audio_src_array[i].dataset["key"];
        key.setAttribute("data-key", key_code);
        // console.log(key);

        //---------------------------------------------- kbd
        const kbd = document.createElement("kbd");
        kbd.textContent = String.fromCharCode(key_code);
        // console.log(String.fromCharCode(key_code));
        key.appendChild(kbd);
      }
      //------------------------------------------ span .sound
      const sound = document.createElement("span");
      sound.classList.add("sound");
      sound.textContent = wav;
      // console.log(sound);
      key.appendChild(sound);
      pads.appendChild(key);
    }

    return pads;
  }
  //------------------------------------------------------------------- main ---
  /**
   * DOMContentLoaded loaded !
   */
  window.addEventListener("DOMContentLoaded", function (event) {
    /* remove example pad */
    const example_pad = document.querySelector(".key");
    example_pad.remove();

    //------------------------------------------------------ draw pads
    const drumpad = document.querySelector(".pad");
    // console.log(drumpad);
    const audio_sources = [...document.querySelectorAll("audio")];
    /* append once to DOM */
    drumpad.appendChild(buildPads(audio_sources));

    /**
     * Build a dictionnary out of our audio src array and pads so we do NOT have
     * to query the DOM every time playsound() is called
     *
     * Use the character instead of the key code to allow use of event.key later
     * on
     *
     *  {...} character : [audio node, pad node]
     *
     * note
     *   a little leap of faith here as we expect nothing moves the pads around
     *   and the order in which the pads were added still matches the order of
     *   the audio sources
     */
    const pads = [...drumpad.querySelectorAll(".key")];
    const pad_dict = {};
    for (let i = 0, length = audio_sources.length; i < length; i++) {
      const key_char = String.fromCharCode(audio_sources[i].dataset["key"]);
      pad_dict[key_char] = [audio_sources[i], pads[i]];
    }

    console.log(pad_dict);
    //---------------------------------------------------- event key press
    document.addEventListener(
      "keydown",
      function (event) {
        const keyName = event.key.toUpperCase();
        // console.log(`${keyName} was pressed`);
        if (keyName in pad_dict) {
          playSound(pad_dict, keyName);
        }
      },
      false
    );
  });
})();
