(function () {
  "use strict";
  /**
   * Transform a given hexadecimal color value string into a [r, g, b] numeric value
   *
   * Expect #FFFFFF format
   * Ignore leading #
   * Parse once
   * Unpack
   *   -> rgb tuple
   */
  function hexToRgb(hex_color) {
    // console.log(hex_color.slice(1, 7));
    const packed_rgb = parseInt(hex_color.slice(1, 7), 16);
    // console.log(packed_rgb);
    const r = (packed_rgb >> 16) & 0xff;
    const g = (packed_rgb >> 8) & 0xff;
    const b = packed_rgb & 0xff;

    return [r, g, b];
  }

  /**
   * Transform a given r, g, b numeric color value into a [h, s, l] numeric
   * color value
   *   -> hsl tuple
   *
   * see : http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
   */
  function rgbToHsl(r, g, b) {
    console.log(`r = ${r}`, `g = ${g}`, `b = ${b}`);
    r /= 255;
    g /= 255;
    b /= 255;
    console.log(`r = ${r}`, `g = ${g}`, `b = ${b}`);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    console.log(`max = ${max}`, `min = ${min}`);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
    console.log(`l = ${l}`);

    if (max !== min) {
      /**
       * If Luminance is smaller then 0.5
       *    Saturation = (max-min)/(max+min)
       * If Luminance is bigger then 0.5
       *    Saturation = ( max-min)/(2.0-max-min)
       */
      let delta = max - min;
      if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      switch (max) {
        // If Red is max, then Hue = (G-B)/(max-min)
        case r:
          h = (g - b) / delta; // + (g < b ? 6 : 0);
          break;
        // If Green is max, then Hue = 2.0 + (B-R)/(max-min)
        case g:
          h = 2 + (b - r) / delta;
          break;
        // If Blue is max, then Hue = 4.0 + (R-G)/(max-min)
        case b:
          h = 4 + (r - g) / delta;
      }
      /**
       * The Hue value needs to be multiplied by 60 to convert it to degrees
       * If Hue becomes negative you need to add 360
       */
      h *= 60;
      if (h < 0) {
        h += 360;
      }
    } else {
      console.log("no sat/hue");
    }
    h = Math.round(h);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    // console.log(`l = ${l}`);

    return [h, s, l];
  }

  //------------------------------------------------------------------- main ---
  /**
   * DOMContentLoaded loaded !
   */
  window.addEventListener("DOMContentLoaded", function (event) {
    let root = document.documentElement;
    // Définir la variable permettant de récupérer l'input de type color
    const color_picker = document.querySelector("#chooser");
    color_picker.value = "#FC8EAC";
    console.log(color_picker);

    // A cette variable, appliquer la méthode (addEventListener) écoutant
    // l'événement de type change et jouant la fonction permettant d'ajouter
    // une propriété de style (SetProperty) au document :
    //      - le nom de la propriété est la variable CSS --main-color
    //      - La valeur est définie par la valeur de l'input

    //------------------------------------------- input change
    color_picker.addEventListener(
      "input",
      function (event) {
        console.log(this.value);
        // console.log(this);
        let [r, g, b] = hexToRgb(this.value);
        console.log(r, g, b);
        let [h, s, l] = rgbToHsl(r, g, b);
        console.log(h, s, l);
        root.style.setProperty("--main-color-h", h);
        root.style.setProperty("--main-color-s", `${s}%`);
        root.style.setProperty("--main-color-l", `${l}%`);
      },
      false
    );
  });
})();
