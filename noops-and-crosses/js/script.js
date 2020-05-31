var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    'use strict';
    /**
     * Extend given object with given trait, clobbering existing properties.
     *
     * @todo Look for ways to update type hint in-place !
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
     * Create a new Observable object.
     *
     * @todo Research which approach is favored to prevent notification cascade.
     * @todo Defer render to after all compositions/updates are done.
     */
    function newObservable(value) {
        const observable = {
            subscribers: [],
            value: value,
            notify: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    // const queue = []; // rate-limit-ish
                    for (let i = 0, length = this.subscribers.length; i < length; i++) {
                        console.log('notifying ' + this.subscribers[i]);
                        // queue.push(this.subscribers[i](this.value)); // rate-limit-ish
                        yield this.subscribers[i](this.value);
                    }
                    // await Promise.all(queue); // rate-limit-ish
                    return;
                });
            },
            subscribe: function (subscriber) {
                this.subscribers.push(subscriber);
            },
            get: function () {
                return this.value;
            },
            set: function (value) {
                if (value !== this.value) {
                    this.value = value;
                    this.notify();
                }
            },
        };
        return observable;
    }
    /**
     * Define Animal helper trait.
     */
    // type Animal = Trait;
    const withAnimal = {
        speak: function () {
            return this.name + ' says ' + this.sound.value + ' !';
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
            sound: newObservable(sound),
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
            // this.sound = sound;
            this.sound.set(sound);
        },
    };
    function isAnimal(object) {
        return object.name !== undefined;
        // return <Animal>object.name !== undefined;
    }
    function isCarnivourousAnimal(object) {
        return object.eat !== undefined;
        // return <Animal & Carnivorous>object.eat !== undefined;
    }
    function isEvolvableAnimal(object) {
        return object.evolveSound !== undefined;
        // return <Animal & Evolvable>object.evolveSound !== undefined;
    }
    //------------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (event) {
        // console.log(this);
        const cow = newAnimal('Margie', 'Mooh');
        // console.log(cow.name);
        // console.log(cow.speak());
        // console.log(cow.bite('you'));
        // console.log(cow);
        // expecting : Cannot assign to 'name' because it is a read-only property.
        // cow.name = 'Marguerite';
        function render(value) {
            console.log(value + ' just add tagged template now ! ');
        }
        function renderSoon(value) {
            return new Promise((resolve) => {
                console.log('renderSoon value : ' + value);
                setTimeout(function (value) {
                    render(value);
                    resolve('renderSoon');
                    console.log('renderSoon is done');
                }, 1000, value);
            });
        }
        function renderLate(value) {
            return new Promise((resolve) => {
                console.log('renderLate value : ' + value);
                setTimeout(function (value) {
                    render(value);
                    resolve('renderLate');
                    console.log('renderLate is done');
                }, 2000, value);
            });
        }
        function renderLater(value) {
            return new Promise((resolve) => {
                console.log('renderLater value : ' + value);
                setTimeout(function (value) {
                    render(value);
                    resolve('renderLater');
                    console.log('renderLater is done');
                }, 3000, value);
            });
        }
        // mutate read-only properties via defined methods
        cow.sound.subscribe(console.log);
        cow.evolveSound('Boooooh');
        console.log(cow.speak());
        cow.sound.subscribe(renderLate);
        cow.sound.subscribe(renderLater);
        cow.sound.subscribe(render);
        cow.sound.subscribe(renderLate);
        cow.sound.subscribe(render);
        cow.sound.subscribe(renderSoon);
        cow.evolveSound('Ruuuuuuu-paul');
        console.log(cow.speak());
        console.log('I NEED TO HAPPEN NOW');
        renderSoon('ImNotInTheLoop');
        // check types
        // console.log(typeof cow);
        // console.log('is cow an Animal ? ' + isAnimal(cow));
        // console.log(
        //     'is cow a Carnivorous Animal ? ' + isCarnivourousAnimal(cow)
        // );
        // // extend a copy
        // console.log('extending copy_cow withCarnivorous');
        // const copy_cow = extendCopy(cow, withCarnivorous);
        // console.log(
        //     'is cow a Carnivourous Animal ? ' + isCarnivourousAnimal(cow)
        // );
        // // expecting : TypeError: cow.eat is not a function
        // // console.log(cow.eat('the farmer'));
        // console.log(
        //     'is copy_cow a Carnivourous Animal ? ' +
        //         isCarnivourousAnimal(copy_cow)
        // );
        // console.log(copy_cow.eat('the farmer'));
        // // extend
        // console.log('extending cow withCarnivorous');
        // extend(cow, withCarnivorous);
        // console.log(
        //     'is cow a Carnivourous Animal ? ' + isCarnivourousAnimal(cow)
        // );
        // console.log(cow.eat('the farmer'));
        // // final
        // const cow_final = Object.seal(newAnimal('Marguerite', 'Mooh'));
        // console.log(cow_final.name);
        // console.log(cow_final.speak());
        // cow_final.evolveSound('Boooooh');
        // console.log(cow_final.speak());
        // // expecting : TypeError: can't define property "eat": Object is not extensible
        // // extend(cowSealed, withCarnivorous);
        // // immutable
        // const cow_immutable = Object.freeze(newAnimal('Marguerite', 'Mooh'));
        // console.log(cow_immutable.name);
        // console.log(cow_immutable.speak());
        // expecting : TypeError: "sound" is read-only
        // cowFrozen.evolveSound('Boooooh');
        //------------------------------------------------- tagged templates
        // function render() {
        //     console.log('render');
        //     console.log(this);
        // }
        function tag(chunks, ...placeholders) {
            console.log('Tagged templates are amazing !');
            console.log('array of all string chunks in the template :');
            console.log(chunks);
            console.log('array of all placeholders in the template :');
            console.log(placeholders);
        }
        function tick(node, time, tag, template) {
            node.textContent = 'time elapsed :' + (Date.now() - time);
            // console.log(template);
            // console.log(tag);
            // tag`${template}`;
            // node.textContent = template;
        }
        const fragment = document.createDocumentFragment();
        const timer = document.createElement('p');
        fragment.appendChild(timer);
        document.body.appendChild(fragment);
        const p1 = 'templates';
        const p2 = 'more';
        const start = Date.now();
        // const observer_config = {
        //     attributes: true,
        //     childList: true,
        //     subtree: true,
        //     characterData: true,
        // };
        // const report = function (mutations, observer) {
        //     console.log(mutations);
        //     console.log(observer);
        // };
        // const observer = new MutationObserver(report);
        // observer.observe(timer, observer_config);
        // tag`tagged ${p1} look ${p2} powerful every second :`;
        // setInterval(tick, 1000, timer, start, tag, `tagged ${p1} look ${p2} powerful every second :`);
        // setInterval(tick, 1000, , start, );
        // console.log(timer);
        timer.textContent = 'party';
        timer.textContent = 'dparty';
        // fragment.appendChild(timer);
        // timer.textContent ="part";
        // setInterval(tick, 1000, timer, start );
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
// /**
//  * Helper for partial application.
//  *
//  * @note Probably ill-named.
//  */
// function curry(func, ...partial_arg_list) {
//     return function (...args) {
// //         return func(...partial_arg_list, ...args);
//            [head, ...tail] = [args];
//            return func(head, tail);
//     };
// }
// /**
//  * Define Monad Constructor object.
//  */
// interface Monad<T> {
//     (value:T): Monad<T>;
//     bind: (any) => any;
// }
// /**
//  * Create a new Monad.
//  */
// function newMonad<T>(): Monad<T> {
//     return function unit(value: T) {
//         const monad = Object.create(null);
//         monad.bind = function (func) : any {
//             return func(value);
//         };
//         return <Monad<T>>monad;
//     };
// }
// function volumeCuboid(length, height, width) {
//     return length * height * width;
// }
// const cuboid_100 = curry(volumeCuboid, 100);
// console.log(cuboid_100(5, 5));
// console.log(cuboid_100(1, 5));
// console.log(cuboid_100(3, 5));
// const cuboid_100_25 = curry(cuboid_100, 25);
// console.log(cuboid_100_25(3));
// console.log(cuboid_100_25(5));
// const cuboid_10_12 = curry(volumeCuboid, 10, 12);
// console.log(cuboid_10_12(5));
// function hello(msg : string) :string {
//     return msg + msg;
// }
// const identity = newMonad<string>();
// const monad = identity("yo");
// monad.bind(console.log);
// const identity_too = newMonad<Animal>();
// const monad_too = identity_too(cow);
// monad_too.bind(console.log);
// (monad_too.bind(console.log)).bind(alert);
// console.log(tadam);
// destructuring objects
// const {yup : yap} = {yup : () => {return 'hey'}};
// const {yup} = {yup : () => {return 'hey'}};
// console.log(yap);
// console.log(yup);
// console.log(yup());
// const app_proxy = new Proxy({
//     update_done : false,
//     updated_nodes : [],
//     timer : null,
// },
// {
//     set : function (target, property, value, receiver) {
//         console.log('app_proxy set fired');
//         console.log(arguments);
//         target[property] = value;
//         target.updated_nodes.push(property);
//         console.log(target.updated_nodes);
//         if (target.update_done) {
//             console.log('update done ! re-render ');
//         }
//         return true;
//     }
// });
// app_proxy.timer = timer_node;
// app_proxy.timer.textContent = 'green';
// app_proxy.timer.textContent = 'red';
// console.log(app_proxy.timer);
// fragment.addEventListener('change', render);
// const fragment_observer = {
//     set : function (target, prop, receiver)  {
//         // console.log(Reflect.get(...arguments));
//         console.log('yo');
//     },
// }
// const fragment_proxy = new Proxy(fragment, <any>fragment_observer);
// console.log(fragment_proxy);
// fragment_proxy.appendChild(timer);
