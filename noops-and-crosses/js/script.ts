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
            () => {node[property] = observable.value}
        );
        node.addEventListener(event, () =>
            observable.set(node[property])
        );
    }

    /**
     * Define Context object.
     *
     * @todo Consider promoting observables definition to interface
     *       ObservableCollection.
     */
    interface Context {
        readonly observables: { [name: string]: Observable<any> };
        readonly pins: Pin<any>[];
        readonly links: Link<any>[];
        put: (name: string, observable: Observable<any>) => this;
        remove: (name: string) => this;
        merge: (
            another_context:
                | Context
                | { [name: string]: Observable<any> }
        ) => Context;
        musterPins: () => this;
        musterLinks: () => this;
        activatePins: () => this;
        activateLinks: () => this;
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
            pins: [],
            links: [],
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

            /**
             * Collect data pins currently in the DOM for this Context.
             *
             * @note If requested observable source is NOT found or available in
             *       this Context, record its name as a string placeholder.
             *
             * @todo Consider using a dictionnary and an identifier per pin.
             */
            musterPins: function (): Context {
                const pin_nodes = [
                    ...document.querySelectorAll('[data-pin]'),
                ];
                const length = pin_nodes.length;
                const pins = Array(length);

                for (let i = 0; i < length; i++) {
                    const source = pin_nodes[i].getAttribute(
                        'data-pin'
                    );
                    const target = pin_nodes[i].getAttribute(
                        'data-property'
                    );
                    const type = pin_nodes[i].getAttribute('data-type');
                    pins[i] = {
                        source:
                            this.observables[source] !== undefined
                                ? this.observables[source]
                                : source,
                        target: target !== null ? target : 'value',
                        type: type !== null ? type : 'string',
                        node: pin_nodes[i],
                    };
                }
                this.pins = <Pin<any>[]>pins;
                return this;
            },
            /**
             * Collect data links currently in the DOM for this Context.
             *
             * @note If requested observable source is NOT found or available in
             *       this Context, record its name as a string placeholder.
             *
             * @todo Consider using a dictionnary and an identifier per pin.
             */
            musterLinks: function (): Context {
                const link_nodes = [
                    ...document.querySelectorAll('[data-link]'),
                ];
                const length = link_nodes.length;
                const links = Array(length);

                for (let i = 0; i < length; i++) {
                    const source = link_nodes[i].getAttribute(
                        'data-link'
                    );
                    const event = link_nodes[i].getAttribute(
                        'data-event'
                    );
                    const target = link_nodes[i].getAttribute(
                        'data-property'
                    );
                    const type = link_nodes[i].getAttribute(
                        'data-type'
                    );
                    links[i] = {
                        source:
                            this.observables[source] !== undefined
                                ? this.observables[source]
                                : source,
                        target: target !== null ? target : 'value',
                        event: event !== null ? event : 'input',
                        type: type !== null ? type : 'string',
                        node: link_nodes[i],
                    };
                }
                this.links = <Link<any>[]>links;
                return this;
            },
            /**
             * Activate a given pin collection.
             *
             * @todo Deal with incomple Observable-less pins
             */
            activatePins: function (): Context {
                for (
                    let i = 0, length = this.pins.length;
                    i < length;
                    i++
                ) {
                    if (typeof this.pins[i].source !== 'string') {
                        (<Observable<any>>(
                            this.pins[i].source
                        )).subscribe(
                            (value) =>
                                {this.pins[i].node[
                                    this.pins[i].target
                                ] = value}
                        );
                    }
                }
                return this;
            },
            /**
             * Activate a given Link collection.
             *
             * @todo Deal with incomple Observable-less pins
             */
            activateLinks: function (): Context {
                for (
                    let i = 0, length = this.links.length;
                    i < length;
                    i++
                ) {
                    if (typeof this.links[i].source !== 'string') {
                        link(
                            <Observable<any>>this.links[i].source,
                            this.links[i].node,
                            this.links[i].target,
                            this.links[i].event
                        );
                    }
                }
                return this;
            },
        };
        return <Context>context;
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
        sync: Timer | undefined;
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
            start: 0,
            sync: undefined,
            tag: function (): Timer {
                const formatted_time = new Date(
                    Date.now() - this.start + this.elapsed
                )
                    .toISOString()
                    .slice(11, -5);
                // this.observable.value.set(formatted_time);
                this.observable.value.set(
                    Date.now() - this.start + this.elapsed
                );
                return this;
            },
            toggle: function (): Timer {
                // console.log(this.id);
                if (this.id === 0) {
                    this.start = Date.now();
                    const that = this;
                    this.id = setInterval(function (): void {
                        that.tag();
                    }, 1000);
                } else {
                    clearInterval(this.id);
                    // this.elapsed += Date.now() - this.start;
                    /**
                     * @note Round to nearest second to keep setInterval simple.
                     */
                    this.elapsed +=
                        Math.floor((Date.now() - this.start) / 1000) *
                        1000;
                    this.id = 0;
                }
                return this;
            },
            reset: function (): Timer {
                this.elapsed = 0;
                this.start = Date.now();
                return this;
            },
            syncWith: function (ref_timer: Timer): Timer {
                // this.id = another_timer.id;
                // this.elapsed = another_timer.elapsed;
                // this.start = another_timer.start;
                // this.tag();
                this.sync = ref_timer;
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
        //----------------------------------------------------------- timers
        // const global_timer = newObservable<string>('init');
        // const p1_timer = newObservable<string>('init');
        // const p2_timer = newObservable<string>('init');

        const global_timer = newTimer().toggle();
        const p1_timer = newTimer().syncWith(global_timer);
        const p2_timer = newTimer().syncWith(global_timer).toggle();

        const control_timer = newObservable<string>('0');
        p1_timer.observable.value.subscribe((value) => {
            control_timer.set(value + p2_timer.observable.value.get());
        });
        p2_timer.observable.value.subscribe((value) => {
            control_timer.set(value + p1_timer.observable.value.get());
        });

        const timer_context = newContext()
            .put('global_timer', global_timer.observable.value)
            .put('p1_timer', p1_timer.observable.value)
            .put('p2_timer', p2_timer.observable.value)
            .put('control_timer', control_timer)
            .musterPins()
            .musterLinks()
            .activatePins()
            .activateLinks();



        //------------------------------------------------------ play_button
        const play_button = document.querySelector('button[name=play]');
        play_button.addEventListener(
            'click',
            function (event: Event): void {
                p1_timer.toggle();
                p2_timer.toggle();
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
