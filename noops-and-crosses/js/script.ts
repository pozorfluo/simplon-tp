(function () {
    'use strict';

    type Trait = Object;

    /**
     * Extend given object with given trait, clobbering existing properties.
     *
     * @todo Look for ways to update type hint in-place !
     */
    function extend<Base>(object: Base, trait: Trait): void {
        Object.keys(trait).forEach(function (key) {
            object[key] = trait[key];
        });
    }

    /**
     * Extend a shallow copy of given object with given trait, clobbering
     * existing properties.
     */
    function extendCopy<Base, Extension>(
        object: Base,
        trait: Extension
    ): Base & Extension {
        const extended_copy = { ...object };
        Object.keys(trait).forEach(function (key) {
            extended_copy[key] = trait[key];
        });
        return <Base & Extension>extended_copy;
    }

    /**
     * Extend a deep copy of given object with given trait, clobbering existing
     * properties.
     */
    // function extendDeepCopy<Base>(object: Base, trait: Trait): void {
    //     Object.keys(trait).forEach(function (key) {
    //         object[key] = trait[key];
    //     });
    // }

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
     * Define Animal helper trait.
     */
    // type Animal = Trait;
    const withAnimal: Trait = {
        speak: function (): string {
            return this.name + ' says ' + this.sound + ' !';
        },
        bite: function (target: string): string {
            return this.name + ' bites ' + target + ' !';
        },
    };

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

    /**
     * Define Carnivorous trait.
     */
    type Carnivorous = Trait;
    const withCarnivorous: Carnivorous = {
        eat: function (target: string): string {
            return this.name + ' eats ' + target + ' !';
        },
    };

    /**
     * Define Evolvable trait.
     */
    type Evolvable = Trait;
    const withEvolvable: Evolvable = {
        evolveSound: function (sound: string): void {
            this.sound = sound;
        },
    };

    function isAnimal(object: any): object is Animal {
        return object.name !== undefined;
        // return <Animal>object.name !== undefined;
    }

    function isCarnivourousAnimal(object: any): object is Animal & Carnivorous {
        return object.eat !== undefined;
        // return <Animal & Carnivorous>object.eat !== undefined;
    }

    function isEvolvableAnimal(object: any): object is Animal & Evolvable {
        return object.evolveSound !== undefined;
        // return <Animal & Evolvable>object.evolveSound !== undefined;
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

        // extend a copy
        console.log('extending copy_cow withCarnivorous');
        const copy_cow = extendCopy(cow, withCarnivorous);
        console.log(
            'is cow a Carnivourous Animal ? ' + isCarnivourousAnimal(cow)
        );
        // expecting : TypeError: cow.eat is not a function
        // console.log(cow.eat('the farmer'));
        console.log(
            'is copy_cow a Carnivourous Animal ? ' +
                isCarnivourousAnimal(copy_cow)
        );
        console.log(copy_cow.eat('the farmer'));

        // extend
        console.log('extending cow withCarnivorous');
        extend(cow, withCarnivorous);
        console.log(
            'is cow a Carnivourous Animal ? ' + isCarnivourousAnimal(cow)
        );
        console.log(cow.eat('the farmer'));

        // final
        const cow_final = Object.seal(newAnimal('Marguerite', 'Mooh'));
        console.log(cow_final.name);
        console.log(cow_final.speak());
        cow_final.evolveSound('Boooooh');
        console.log(cow_final.speak());
        // expecting : TypeError: can't define property "eat": Object is not extensible
        // extend(cowSealed, withCarnivorous);

        // immutable
        const cow_immutable = Object.freeze(newAnimal('Marguerite', 'Mooh'));
        console.log(cow_immutable.name);
        console.log(cow_immutable.speak());
        // expecting : TypeError: "sound" is read-only
        // cowFrozen.evolveSound('Boooooh');

        /**
         * Helper for partial application.
         *
         * @note Probably ill-named.
         */
        function curry(func, ...partial_arg_list) {
            return function (...args) {
                return func(...partial_arg_list, ...args);
            };
        }

        /**
         * Define Monad Constructor object.
         */
        interface Monad<T> {
            (value:T): Monad<T>;
            bind: (any) => any;
        }
        /**
         * Create a new Monad.
         */
        function newMonad<T>(): Monad<T> {
            return function unit(value: T) {
                const monad = Object.create(null);
                monad.bind = function (func) :any {
                    return func(value);
                };
                return <Monad<T>>monad;
            };
        }

        function volumeCuboid(length, height, width) {
            return length * height * width;
        }
        const cuboid_100 = curry(volumeCuboid, 100);
        console.log(cuboid_100(5, 5));
        console.log(cuboid_100(1, 5));
        console.log(cuboid_100(3, 5));
        const cuboid_100_25 = curry(cuboid_100, 25);
        console.log(cuboid_100_25(3));
        console.log(cuboid_100_25(5));
        const cuboid_10_12 = curry(volumeCuboid, 10, 12);
        console.log(cuboid_10_12(5));

        function hello(msg : string) :string {
            return msg + msg;
        }

        const identity = newMonad<string>();
        const monad = identity("yo");
        monad.bind(console.log);

        // console.log(tadam);


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
