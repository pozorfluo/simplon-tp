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
     * Extend given object with given trait, stacking existing properties as
     * follow :
     *
     *   Merge objects.
     *   Append to arrays.
     *   Clobber scalars.
     *
     * @note Changing the 'shape' of an existing property would most likely be a
     *       recipe for disaster.
     */
    function cram<Base, Trait>(
        object: Base,
        trait: Trait
    ): Base & Trait {
        Object.keys(trait).forEach(function (key) {
            switch (typeof object[key]) {
                case 'object':
                    if (Array.isArray(object[key])) {
                        [...object[key], trait[key]];
                    } else {
                        extend(object[key], trait[key]);
                    }
                    break;
                case undefined:
                // break;
                default:
                    /* undefined and scalars */
                    object[key] = trait[key];
                    break;
            }
        });
        return <Base & Trait>object;
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
     * @todo Consider tracking Observables in a list.
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
     * Define Observable trait.
     */
    function withObservable<T>(
        name: string,
        value: T
    ): Observable<T> & Trait {
        const trait: any = { observable: {} }; //  Record<string, Observable<T>>
        trait.observable[name] = newObservable<T>(value);
        return <Observable<T> & Trait>trait;
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
     * Define Context object.
     */
    interface Context {
        readonly observables: { [name: string]: Observable<any> };
        put: (name: string, observable: Observable<any>) => Context;
        remove: (name: string) => Context;
        merge: (
            another_context:
                | Context
                | { [name: string]: Observable<any> }
        ) => Context;

        [extension: string]: any; // open for extension.
    }

    /**
     * Create a new Context object.
     *
     * @note put and merge will clobber existing entries.
     */
    function newContext(): Context {
        const context: any = {
            observables: {},

            put: function (
                name: string,
                observable: Observable<any>
            ): Context {
                this.observables[name] = observable;
                return this;
            },

            remove: function (name: string): Context {
                if (this.observables[name] !== undefined) {
                    delete this.observables[name];
                }
                return this;
            },

            merge: function (
                another_context:
                    | Context
                    | { [name: string]: Observable<any> }
            ): Context {
                if (another_context.observables !== undefined) {
                    another_context = another_context.observables;
                }
                extend(this.observables, another_context);
                return this;
            },
        };
        return <Context>context;
    }

    /**
     * Define Pin object.
     *
     * @var source Observed source.
     * @var target Property to target with update inside the downstream Node.
     * @var type Observed value type.
     *
     * @todo Add Tag / component / render function callback.
     */
    interface Pin<T> {
        source: Observable<T> | string;
        target: string;
        type: string;
        node: Node;
    }

    /**
     * Define Link object.
     * @var event Node Event type triggering an update of the upstream Observed
     *            source with the downstream Node target value.
     */
    interface Link<T> extends Pin<T> {
        event: string;
    }

    /**
     * Collect data pins currently in the DOM for a given Context.
     *
     * @note If requested observable source is NOT found or available in given
     *       Context, record its name as a string placeholder.
     *
     * @todo Consider using a dictionnary and an identifier per pin.
     * @todo Consider make it a Context method.
     */
    function musterPins(context: Context): Pin<any>[] {
        const pin_nodes = [...document.querySelectorAll('[data-pin]')];
        const length = pin_nodes.length;
        const pins = Array(length);

        for (let i = 0; i < length; i++) {
            const source = pin_nodes[i].getAttribute('data-pin');
            const target = pin_nodes[i].getAttribute('data-property');
            const type = pin_nodes[i].getAttribute('data-type');
            pins[i] = {
                source:
                    context.observables[source] !== undefined
                        ? context.observables[source]
                        : source,
                target: target !== null ? target : 'value',
                type: type !== null ? type : 'string',
                node: pin_nodes[i],
            };
        }

        return <Pin<any>[]>pins;
    }

    /**
     * Activate a given pin collection.
     *
     * @todo Deal with incomple Observable-less pins
     */
    function activatePins(pins: Pin<any>[]): void {
        for (let i = 0, length = pins.length; i < length; i++) {
            if (typeof pins[i].source !== 'string') {
                (<Observable<any>>pins[i].source).subscribe(
                    (value) => (pins[i].node[pins[i].target] = value)
                );
            }
        }
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

        function tick(target, time, tag, template) {
            target.set('time elapsed :' + (Date.now() - time));
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

        const start = Date.now();

        setInterval(tick, 1000, observable_state, start);

        const base_object = extendCopy(
            {},
            withObservable<string>(
                'observable_extension',
                'notice me !'
            )
        );
        console.log(base_object);
        cram(
            base_object,
            withObservable<string>('another_observe', 'let me in')
        );
        console.log(base_object);
        cram(
            base_object,
            withObservable<string>('yet_another', 'make some room')
        );
        console.log(JSON.stringify(base_object));
        console.log(base_object.observable.observable_extension);
        console.log(base_object.observable.another_observe);
        console.log(base_object.observable.yet_another);

        const test_context = newContext();

        /**
         *  !!! PAY ATTENTION this is METHOD CHAINING !!!
         *
         * Test_context mutates along the way for now.
         */
        test_context
            .put('timer', observable_state)
            .remove('timer')
            .put('timer', observable_state)
            .merge({
                timer: observable_state,
                timer2: observable_state,
                timer3: observable_state,
            })
            .remove('timer2');

        const another_context = newContext();
        another_context
            .put('another_timer', observable_state)
            .merge(test_context);
        console.log(another_context);

        activatePins(musterPins(test_context));
        /**
         * @todo Render single component.
         * @todo Batch renders.
         */
    }); /* DOMContentLoaded */
})(); /* IIFE */
