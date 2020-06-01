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
     * Define Subscriber callback.
     */
    interface Subscriber<T> {
        (value: T): void;
        // priority : number;
    }

    /**
     * Define Observable object.
     *
     */
    interface Observable<T> {
        subscribers: Subscriber<T>[];
        value: T;
        notify: () => void;
        subscribe: (
            subscriber: Subscriber<T>,
            priority?: number
        ) => void;
        unsubscribe: (subscriber: Subscriber<T>) => void;
        get: () => T;
        set: (value: T) => void;
        [extension: string]: any; // open for extension.
    }

    /**
     * Create a new Observable object.
     *
     * @note Optional parameter priority in subscribe method is the index where
     *       given Subscriber is going to be 'spliced' in the subscribers list.
     *       If no paramater is supplied, given Subscriber is appended.
     *
     * @todo Research which approach is favored to prevent notification cascade.
     * @todo Defer render to after all compositions/updates are done.
     * @todo Consider using a binary heap for finer grain control of subscribers
     *       priority.
     * @todo Add unsubscribe method.
     */
    function newObservable<T>(value: T): Observable<T> {
        const observable: any = {
            subscribers: [],
            value: value,

            notify: async function (): Promise<T> {
                // const queue = []; // rate-limit-ish
                console.log(this.subscribers);
                for (
                    let i = 0, length = this.subscribers.length;
                    i < length;
                    i++
                ) {
                    console.log('notifying ' + this.subscribers[i]);
                    // queue.push(this.subscribers[i](this.value)); // rate-limit-ish
                    await this.subscribers[i](this.value);
                }
                // await Promise.all(queue); // rate-limit-ish
                /**
                 * @todo consider ES2020 Promise.allSettled
                 */
                return;
            },

            subscribe: function (
                subscriber: Subscriber<T>,
                priority?: number
            ): void {
                if (priority === undefined) {
                    this.subscribers.push(subscriber);
                } else {
                    this.subscribers.splice(priority, 0, subscriber);
                }
                // console.log(this.subscribers);
            },

            get: function (): T {
                /* Notify that a read is happening here if necessary */
                return this.value;
            },

            set: function (value: T): void {
                if (value !== this.value) {
                    this.value = value;
                    this.notify();
                } /* the buck stops here */
            },
        };
        return <Observable<T>>observable;
    }

    /**
     * Set a 2-way link between given Observable and given DOM node.
     *
     * @todo Consider that the node emitting the original event probably
     *       does not need to be notified back/updated if it is only
     *       dependency.
     * @todo Add unlink function.
     */
    function link<T>(
        observable: Observable<T>,
        node: Node,
        property = 'value',
        event = 'input'
    ): void {
        console.log(arguments);
        node[property] = observable.get();
        observable.subscribe(
            // () => (node[property] = observable.get())
            () => (node[property] = observable.value)
        );
        node.addEventListener(event, () =>
            observable.set(node[property])
        );
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
        readonly sound: Observable<string>;
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
            return this.name + ' says ' + this.sound.value + ' !';
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
            sound: newObservable<string>(sound),
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
            // this.sound = sound;
            this.sound.set(sound);
        },
    };

    function isAnimal(object: any): object is Animal {
        return object.name !== undefined;
        // return <Animal>object.name !== undefined;
    }

    function isCarnivourousAnimal(
        object: any
    ): object is Animal & Carnivorous {
        return object.eat !== undefined;
        // return <Animal & Carnivorous>object.eat !== undefined;
    }

    function isEvolvableAnimal(
        object: any
    ): object is Animal & Evolvable {
        return object.evolveSound !== undefined;
        // return <Animal & Evolvable>object.evolveSound !== undefined;
    }
    //------------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (
        event: Event
    ) {
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

        //------------------------------------------ subscribing and linking
        const fragment = document.createDocumentFragment();
        const timer = document.createElement('p');
        const input = document.createElement('input');
        const output = document.createElement('input');
        input.type = 'text';
        output.type = 'text';
        fragment.appendChild(timer);
        fragment.appendChild(input);
        fragment.appendChild(output);
        document.body.appendChild(fragment);

        const observable_state = newObservable<string>('init');

        // 1-way
        observable_state.subscribe(
            (value) => (timer.textContent = value)
        );

        // 2-way link
        link<string>(observable_state, input);
        link<string>(observable_state, output, 'value', 'change');

        const p1 = 'templates';
        const p2 = 'more';
        const start = Date.now();

        setInterval(tick, 1000, timer, start);
    }); /* DOMContentLoaded */
})(); /* IIFE */

// console.log(this);

// const cow = newAnimal('Margie', 'Mooh');

// console.log(cow.name);
// console.log(cow.speak());
// console.log(cow.bite('you'));
// console.log(cow);

// expecting : Cannot assign to 'name' because it is a read-only property.
// cow.name = 'Marguerite';

/**
 * Keep Subscriber simple, build the callback from partial application
 * instead of moving arguments around.
 */
// interface Subscriber<T> {
//     callback : (value: T) => void;
//     args: any[];
// }

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

// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }

// let subscribers = [
//     'aaaa',
//     'bbbbb',
//     'cccc',
//     'dddd',
//     'aaaa',
//     'bbbbb',
//     'cccc',
//     'dddd',
// ];
// let subscribers2 = [
//     'aaaa',
//     'bbbbb',
//     'cccc',
//     'dddd',
//     'aaaa',
//     'bbbbb',
//     'cccc',
//     'dddd',
// ];

// for (let j = 5; j < 1000; j++) {
//     const splice_me = getRandomInt(100);
//     // const splice_me = j;
//     subscribers = [
//         ...subscribers.slice(0, splice_me),
//         splice_me,
//         ...subscribers.slice(splice_me),
//     ];
//     subscribers2.splice(splice_me, 0, splice_me);
// }

// for (let i = 0, length = subscribers.length; i < length; i++) {
//     console.log(
//         subscribers[i] +
//             ' === ' +
//             subscribers2[i] +
//             ' ' +
//             (subscribers[i] === subscribers2[i])
//     );
// }
// console.log(subscribers);
// console.log(subscribers2);

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

// function render(value) {
//     console.log(value + ' just add tagged template now ! ');
// }

// function resolveSoon(value) {
//     return new Promise((resolve) => {
//         console.log('resolveSoon value : ' + value);
//         setTimeout(
//             function (value) {
//                 render(value);
//                 resolve('resolveSoon');
//                 console.log('resolveSoon is done');
//             },
//             1000,
//             value
//         );
//     });
// }

// function resolveLate(value) {
//     return new Promise((resolve) => {
//         console.log('resolveLate value : ' + value);
//         setTimeout(
//             function (value) {
//                 render(value);
//                 resolve('resolveLate');
//                 console.log('resolveLate is done');
//             },
//             2000,
//             value
//         );
//     });
// }

// function resolveLater(value) {
//     return new Promise((resolve) => {
//         console.log('resolveLater value : ' + value);
//         setTimeout(
//             function (value) {
//                 render(value);
//                 resolve('resolveLater');
//                 console.log('resolveLater is done');
//             },
//             3000,
//             value
//         );
//     });
// }

// function resolveFirst(value) {
//     return new Promise((resolve) => {
//         console.log('resolveFirst value : ' + value);
//         setTimeout(
//             function (value) {
//                 render(value);
//                 resolve('resolveFirst');
//                 console.log('resolveFirst is done');
//             },
//             1000,
//             value
//         );
//     });
// }
// function resolveLast(value) {
//     return new Promise((resolve) => {
//         console.log('resolveLast value : ' + value);
//         setTimeout(
//             function (value) {
//                 render(value);
//                 resolve('resolveLast');
//                 console.log('resolveLast is done');
//             },
//             1000,
//             value
//         );
//     });
// }

// // mutate read-only properties via defined methods
// cow.sound.subscribe(console.log);
// cow.evolveSound('Boooooh');
// // console.log(cow.speak());
// cow.sound.subscribe(resolveLate);
// cow.sound.subscribe(console.log);
// cow.sound.subscribe(console.log, 3);
// cow.sound.subscribe(resolveLater);
// cow.sound.subscribe(render);
// cow.sound.subscribe(resolveLate);
// cow.sound.subscribe(render);
// cow.sound.subscribe(resolveSoon);
// cow.sound.subscribe(resolveLast);
// cow.sound.subscribe(resolveFirst, 0);

// cow.evolveSound('Ruuuuuuu-paul');
// // console.log(cow.speak());
// console.log('I NEED TO HAPPEN NOW');
// // resolveSoon('ImNotInTheLoop');

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

// fragment.appendChild(timer);
// timer.textContent ="part";
