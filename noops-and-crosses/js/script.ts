(function () {
    'use strict';

    type Trait = Object;

    /**
     * Extend given object with given trait, clobbering existing properties.
     * 
     * @todo Implement extendCopy() to return a properly typed extended clone. 
     */
    function extend<Base>(object: Base, trait: Trait): void {
        Object.keys(trait).forEach(function (key) {
            object[key] = trait[key];
        });
    }

    /**
     * Define Animal trait.
     */
    const withAnimal: Trait = {
        speak: function (): string {
            return this.name + ' says ' + this.sound + ' !';
        },
        bite: function (target: string): string {
            return this.name + ' bites ' + target + ' !';
        },
    };

    /**
     * Define Carnivorous trait.
     */
    const withCarnivorous: Trait = {
        eat: function (target: string): string {
            return this.name + ' eats ' + target + ' !';
        },
    };

    /**
     * Define Evolvable trait.
     */
    const withEvolvable: Trait = {
        evolveSound: function (sound: string): void {
            this.sound = sound;
        },
    };

    /**
     * Define Animal object.
     */
    interface Animal {
        readonly name: string;
        readonly sound: string;
        [extension: string]: any; // open for extension.
        // speak: () => string;
        // bite: (target: string) => string;
        // evolveSound: (sound: string) => void;
    }

    /**
     * Create a new Animal object.
     */
    function newAnimal(name: string, sound: string): Animal {
        const animal: any = {
            name: name,
            sound: sound,
        };
        extend(animal, withAnimal);
        extend(animal, withEvolvable);
        return <Animal>animal;
        // return Object.freeze(animal);
        // return Object.seal(animal);
    }

    function isAnimal(test: any): test is Animal {
        return <Animal>test.name !== undefined;
    }

    function isCarnivourousAnimal(test: any): test is Animal & Trait {
        return <Animal>test.eat !== undefined;
    }
    //------------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (event: Event) {
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
        console.log(
            'is cow a Carnivorous Animal ? ' + isCarnivourousAnimal(cow)
        );

        // extension
        console.log('extending cow withCarnivorous');
        extend(cow, withCarnivorous);
        console.log(
            'is cow a Carnivourous Animal ? ' + isCarnivourousAnimal(cow)
        );
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
