(function () {
    'use strict';
    //---------------------------------------------------------------- komrad.ts
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

    //------------------------------------------------------------------ solo.ts
    /**
     * Define Subscriber callback.
     */
    interface Subscriber<T> {
        (value: T): void;
    }

    /**
     * Define Observable object.
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
                // console.log(this.subscribers);
                for (
                    let i = 0, length = this.subscribers.length;
                    i < length;
                    i++
                ) {
                    // console.log('notifying ' + this.subscribers[i]);
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
        // console.log(arguments);
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
     * @todo Consider making it a method of Context object.
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
     * Collect data links currently in the DOM for a given Context.
     *
     * @note If requested observable source is NOT found or available in given
     *       Context, record its name as a string placeholder.
     *
     * @todo Consider using a dictionnary and an identifier per pin.
     * @todo Consider making it a method of Context object.
     */
    function musterLinks(context: Context): Link<any>[] {
        const link_nodes = [
            ...document.querySelectorAll('[data-link]'),
        ];
        const length = link_nodes.length;
        const links = Array(length);

        for (let i = 0; i < length; i++) {
            const source = link_nodes[i].getAttribute('data-link');
            const event = link_nodes[i].getAttribute('data-event');
            const target = link_nodes[i].getAttribute('data-property');
            const type = link_nodes[i].getAttribute('data-type');
            links[i] = {
                source:
                    context.observables[source] !== undefined
                        ? context.observables[source]
                        : source,
                target: target !== null ? target : 'value',
                event: event !== null ? event : 'input',
                type: type !== null ? type : 'string',
                node: link_nodes[i],
            };
        }

        return <Link<any>[]>links;
    }

    /**
     * Activate a given pin collection.
     *
     * @todo Deal with incomple Observable-less pins
     * @todo Consider making it a method of Context object.
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

    /**
     * Activate a given pin collection.
     *
     * @todo Deal with incomple Observable-less pins
     * @todo Consider making it a method of Context object.
     */
    function activateLinks(links: Link<any>[]): void {
        for (let i = 0, length = links.length; i < length; i++) {
            if (typeof links[i].source !== 'string') {
                link(
                    <Observable<any>>links[i].source,
                    links[i].node,
                    links[i].target,
                    links[i].event
                );
            }
        }
    }

    //-------------------------------------------------------- noops-and-crosses
    /**
     * Define Timer object.
     *
     * @var id interval ID
     */
    interface Timer {
        id: number;
        elapsed: number;
        start: number;
        readonly observable: { value: Observable<string> };
        tag: () => this; // template: TemplateStringsArray
        toggle: () => this;
        reset: () => this;
        syncWith: (timer: Timer) => this;
    }

    /**
     * Create new Timer object.
     */
    function newTimer(): Timer & Observable<string> {
        const timer: any = {
            id: 0,
            elapsed: 0,
            // start: start_time !== undefined ? start_time : Date.now(),
            start: 0,
            // observable : {
            //     value : newObservable<string>('')
            // },
            tag: function (): Timer {
                const formatted_time = new Date(
                    Date.now() - this.start + this.elapsed
                )
                    .toISOString()
                    .slice(11, -5);
                // console.log(formatted_time);
                // console.log(this.start);
                this.observable.value.set(
                    'time elapsed : ' + formatted_time
                );
                return this;
            },
            toggle: function (): Timer {
                console.log(this.id);
                if (this.id === 0) {
                    // console.log(this.tag.bind(this))
                    // this.id = setInterval(this.tag, 1000);
                    // this.id = setInterval(this.tag.bind(this), 1000);
                    // console.log(this);
                    // this.id = setInterval(this.tag, 1000, this);
                    // this.id = setInterval(() =>  {this.tag()}, 1000);
                    this.start = Date.now();
                    const that = this;
                    this.id = setInterval(function () :void {
                        that.tag();
                    }, 1000);

                } else {
                    clearInterval(this.id);
                    this.elapsed = Date.now() - this.start;
                    this.id = 0;
                }
                return this;
            },
            reset: function (): Timer {
                this.elapsed = 0;
                this.start = Date.now();
                return this;
            },
            syncWith: function (another_timer: Timer): Timer {
                this.id = another_timer.id;
                this.elapsed = another_timer.elapsed;
                this.start = another_timer.start;
                this.tag();
                return this;
            },
        };
        extend(timer, withObservable<string>('value', ''));
        return <Timer & Observable<string>>timer;
    }

    //----------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (
        event: Event
    ) {
        //------------------------------------------ subscribing and linking
        // const global_timer = newObservable<string>('init');
        // const p1_timer = newObservable<string>('init');
        // const p2_timer = newObservable<string>('init');

        const global_timer = newTimer();
        // const p1_timer = newTimer().syncWith(global_timer);
        // const p2_timer = newTimer().syncWith(global_timer);
        console.log(global_timer);
        global_timer;
        const timer_context = newContext().put(
            'global_timer',
            global_timer.observable.value
        );

        // .put('p1_timer', p1_timer.observable.value)
        // .put('p2_timer', p2_timer.observable.value);

        const timer_pins = musterPins(timer_context);
        activatePins(timer_pins);
        activateLinks(musterLinks(timer_context));
        // const start = Date.now();
        // let global_timer_id = 0;
        // setInterval(tick, 1500, p1_timer, start);
        // setInterval(tick, 2000, p2_timer, start);

        const play_button = document.querySelector('button[name=play]');

        //------------------------------------------------ play_button click
        play_button.addEventListener(
            'click',
            function (event: Event): void {
                console.log(global_timer);
                global_timer.toggle() ;
                event.stopPropagation();
            },
            false
        );
        /**
         * @todo Render single component.
         * @todo Batch renders.
         */
    }); /* DOMContentLoaded */
})(); /* IIFE */
