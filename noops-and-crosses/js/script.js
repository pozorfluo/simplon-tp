(function () {
  "use strict";

  /**
   * Extend given object with given trait, clobbering existing properties.
   */
  function extend(object, trait) {
    Object.keys(trait).forEach(function (key) {
      object[key] = trait[key];
    });
  }

  /**
   * Extend given object with given trait.
   */
  function extendSoftly(object, trait) {
    Object.keys(trait).forEach(function (key) {
      // console.log(key);
      if (typeof object[key] !== "undefined") {
        return;
      }
      object[key] = trait[key];
    });
  }

  /**
   * Define Animal trait.
   */
  const withAnimal = {
    speak: function () {
      return this.name + " says " + this.sound + " !";
    },
    bite: function (target) {
      return this.name + " bites " + target + " !";
    },
  };

  /**
   * Define Carnivorous trait.
   */
  const withCarnivorous = {
    eat: function (target) {
      return this.name + " eats " + target + " !";
    },
  };

  /**
   * Define Evolvable trait.
   */
  const withEvolvable = {
    evolveSound: function (sound) {
      this.sound = sound;
    },
  };

  /**
   * Create a new Animal object.
   */
  function newAnimal(name, sound) {
    const animal = {
      name: name,
      sound: sound,
    };
    extend(animal, withAnimal);
    extend(animal, withEvolvable);
    return animal;
    // return Object.freeze(animal);
    // return Object.seal(animal);
  }

  //------------------------------------------------------------------- main ---
  /**
   * DOMContentLoaded loaded !
   */
  window.addEventListener("DOMContentLoaded", function (event) {
    // console.log(this);

    const cow = newAnimal("Margie", "Mooh");
    console.log(cow.name);
    console.log(cow.speak());
    cow.evolveSound('Boooooh')
    console.log(cow.speak());
    console.log(cow.bite("you"));
    console.log(cow);

    // final
    const cowSealed = Object.seal(newAnimal("Marguerite", "Mooh"));
    console.log(cowSealed.name);
    console.log(cowSealed.speak());
    cowSealed.evolveSound('Boooooh')
    console.log(cowSealed.speak());

    // immutable
    const cowFrozen = Object.freeze(newAnimal("Marguerite", "Mooh"));
    console.log(cowFrozen.name);
    console.log(cowFrozen.speak());
    cowFrozen.evolveSound('Boooooh')
    console.log(cowFrozen.speak());

  }); /* DOMContentLoaded */
})(); /* IIFE */

// function extend2(object, trait) {
//   console.log(Object.keys(trait).length);
//   console.log([...Object.keys(trait)]);
//   console.log(trait);
//   for (let i = 0, length = Object.keys(trait).length; i < length; i++) {
//     console.log(object[i]);
//     console.log(trait[i]);
//     object[i] = trait[i];
//   }
// }

// function extend3(object, trait) {
//   console.log(Object.keys(trait));
//   keys = Object.keys(trait);
//   for (let i = 0, length = keys.length; i < length; i++) {
//     console.log(object[keys[i]]);
//     console.log(trait[keys[i]]);
//     object[keys[i]] = trait[keys[i]];
//   }
// }
