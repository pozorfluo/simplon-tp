(function () {
    'use strict';
    /**
     * Extend given object with given trait, clobbering existing properties.
     *
     * @todo Implement extendCopy() to return a properly typed extended clone.
     */
    function extend(object, trait) {
        Object.keys(trait).forEach(function (key) {
            object[key] = trait[key];
        });
    }
    /**
     * Extend a shallow copy of given object with given trait, clobbering
     * existing properties.
     */
    function extendCopy(object, trait) {
        const extended_copy = Object.assign({}, object);
        Object.keys(trait).forEach(function (key) {
            extended_copy[key] = trait[key];
        });
        return extended_copy;
    }
    /**
     * Define Animal helper trait.
     */
    // type Animal = Trait;
    const withAnimal = {
        speak: function () {
            return this.name + ' says ' + this.sound + ' !';
        },
        bite: function (target) {
            return this.name + ' bites ' + target + ' !';
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
    const withCarnivorous = {
        eat: function (target) {
            return this.name + ' eats ' + target + ' !';
        },
    };
    const withEvolvable = {
        evolveSound: function (sound) {
            this.sound = sound;
        },
    };
    function isAnimal(test) {
        return test.name !== undefined;
    }
    function isCarnivourousAnimal(test) {
        return test.eat !== undefined;
    }
    function isEvolvableAnimal(test) {
        return test.evolveSound !== undefined;
    }
    //------------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (event) {
        // console.log(this);
        const cow = newAnimal('Margie', 'Mooh');
        console.log(cow.name);
        console.log(cow.speak());
        console.log(cow.bite('you'));
        console.log(cow);
        // expecting : Cannot assign to 'name' because it is a read-only property.
        // cow.name = 'Marguerite';
        // mutate read-only properties via defined methods
        cow.evolveSound('Boooooh');
        console.log(cow.speak());
        // check types
        // console.log(typeof cow);
        console.log('is cow an Animal ? ' + isAnimal(cow));
        console.log('is cow a Carnivorous Animal ? ' + isCarnivourousAnimal(cow));
        // extend a copy
        console.log('extending copy_cow withCarnivorous');
        const copy_cow = extendCopy(cow, withCarnivorous);
        console.log('is cow a Carnivourous Animal ? ' + isCarnivourousAnimal(cow));
        // expecting : TypeError: cow.eat is not a function
        // console.log(cow.eat('the farmer'));
        console.log('is copy_cow a Carnivourous Animal ? ' +
            isCarnivourousAnimal(copy_cow));
        console.log(copy_cow.eat('the farmer'));
        // extend
        console.log('extending cow withCarnivorous');
        extend(cow, withCarnivorous);
        console.log('is cow a Carnivourous Animal ? ' + isCarnivourousAnimal(cow));
        console.log(cow.eat('the farmer'));
        // final
        const cowSealed = Object.seal(newAnimal('Marguerite', 'Mooh'));
        console.log(cowSealed.name);
        console.log(cowSealed.speak());
        cowSealed.evolveSound('Boooooh');
        console.log(cowSealed.speak());
        // expecting : TypeError: can't define property "eat": Object is not extensible
        // extend(cowSealed, withCarnivorous);
        // immutable
        const cowFrozen = Object.freeze(newAnimal('Marguerite', 'Mooh'));
        console.log(cowFrozen.name);
        console.log(cowFrozen.speak());
        // expecting : TypeError: "sound" is read-only
        // cowFrozen.evolveSound('Boooooh');
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
/**
 * Extend given object with given trait, clobbering existing properties.
 */
// function extend(object: Object, trait: Trait) {
//     Object.keys(trait).forEach(function (key) {
//         object[key] = trait[key];
//     });
// }
/**
 * Extend given object with given trait.
 */
// function extendSoftly(object: Object, trait: Trait) {
//     Object.keys(trait).forEach(function (key) {
//         // console.log(key);
//         if (typeof object[key] !== 'undefined') {
//             return;
//         }
//         object[key] = trait[key];
//     });
// }
