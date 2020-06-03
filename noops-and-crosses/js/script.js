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
    function cram(object, trait) {
        Object.keys(trait).forEach(function (key) {
            switch (typeof object[key]) {
                case 'object':
                    if (Array.isArray(object[key])) {
                        [...object[key], trait[key]];
                    }
                    else {
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
        return object;
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
    function newObservable(value) {
        const observable = {
            subscribers: [],
            value: value,
            notify: async function () {
                // const queue = []; // rate-limit-ish
                // console.log(this.subscribers);
                for (let i = 0, length = this.subscribers.length; i < length; i++) {
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
            subscribe: function (subscriber, priority) {
                if (priority === undefined) {
                    this.subscribers.push(subscriber);
                }
                else {
                    this.subscribers.splice(priority, 0, subscriber);
                }
            },
            get: function () {
                /* Notify that a read is happening here if necessary */
                return this.value;
            },
            set: function (value) {
                if (value !== this.value) {
                    this.value = value;
                    this.notify();
                } /* the buck stops here */
            },
        };
        return observable;
    }
    /**
     * Define Observable trait.
     */
    function withObservable(name, value) {
        const trait = { observable: {} }; //  Record<string, Observable<T>>
        trait.observable[name] = newObservable(value);
        return trait;
    }
    /**
     * Set a 2-way link between given Observable and given DOM node.
     *
     * @todo Consider that the node emitting the original event probably
     *       does not need to be notified back/updated if it is only
     *       dependency.
     * @todo Add unlink function.
     */
    function link(observable, node, property = 'value', event = 'input') {
        // console.log(arguments);
        node[property] = observable.get();
        observable.subscribe(
        // () => (node[property] = observable.get())
        () => { node[property] = observable.value; });
        node.addEventListener(event, () => observable.set(node[property]));
    }
    /**
     * Create a new Context object.
     *
     * @note put and merge will clobber existing entries.
     */
    function newContext() {
        const context = {
            observables: {},
            pins: [],
            links: [],
            put: function (name, observable) {
                this.observables[name] = observable;
                return this;
            },
            remove: function (name) {
                if (this.observables[name] !== undefined) {
                    delete this.observables[name];
                }
                return this;
            },
            merge: function (another_context) {
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
            musterPins: function () {
                const pin_nodes = [
                    ...document.querySelectorAll('[data-pin]'),
                ];
                const length = pin_nodes.length;
                const pins = Array(length);
                for (let i = 0; i < length; i++) {
                    const source = pin_nodes[i].getAttribute('data-pin');
                    const target = pin_nodes[i].getAttribute('data-property');
                    const type = pin_nodes[i].getAttribute('data-type');
                    pins[i] = {
                        source: this.observables[source] !== undefined
                            ? this.observables[source]
                            : source,
                        target: target !== null ? target : 'value',
                        type: type !== null ? type : 'string',
                        node: pin_nodes[i],
                    };
                }
                this.pins = pins;
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
            musterLinks: function () {
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
                        source: this.observables[source] !== undefined
                            ? this.observables[source]
                            : source,
                        target: target !== null ? target : 'value',
                        event: event !== null ? event : 'input',
                        type: type !== null ? type : 'string',
                        node: link_nodes[i],
                    };
                }
                this.links = links;
                return this;
            },
            /**
             * Activate a given pin collection.
             *
             * @todo Deal with incomple Observable-less pins
             */
            activatePins: function () {
                for (let i = 0, length = this.pins.length; i < length; i++) {
                    if (typeof this.pins[i].source !== 'string') {
                        (this.pins[i].source).subscribe((value) => {
                            this.pins[i].node[this.pins[i].target] = value;
                        });
                    }
                }
                return this;
            },
            /**
             * Activate a given Link collection.
             *
             * @todo Deal with incomple Observable-less pins
             */
            activateLinks: function () {
                for (let i = 0, length = this.links.length; i < length; i++) {
                    if (typeof this.links[i].source !== 'string') {
                        link(this.links[i].source, this.links[i].node, this.links[i].target, this.links[i].event);
                    }
                }
                return this;
            },
        };
        return context;
    }
    /**
     * Create new Timer object.
     */
    function newTimer() {
        const timer = {
            id: 0,
            elapsed: 0,
            start: 0,
            // sync: undefined,
            tag: function () {
                const formatted_time = new Date(performance.now() - this.start + this.elapsed)
                    .toISOString()
                    .slice(11, -5);
                this.observable.value.set(formatted_time);
                return this;
            },
            toggle: function () {
                if (this.id === 0) {
                    this.start = performance.now();
                    const that = this;
                    this.id = setInterval(function () {
                        that.tag();
                    }, 500);
                }
                else {
                    clearInterval(this.id);
                    this.tag();
                    this.elapsed += performance.now() - this.start;
                    this.id = 0;
                }
                return this;
            },
            reset: function () {
                this.elapsed = 0;
                this.start = performance.now();
                return this;
            },
            syncWith: function (another_timer) {
                this.elapsed = another_timer.elapsed;
                this.start = another_timer.start;
                this.tag();
                // this.sync = ref_timer;
                return this;
            },
        };
        extend(timer, withObservable('value', ''));
        return timer;
    }
    //----------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (event) {
        //----------------------------------------------------------- timers
        // const global_timer = newObservable<string>('init');
        // const p1_timer = newObservable<string>('init');
        // const p2_timer = newObservable<string>('init');
        const p1_timer = newTimer().toggle();
        const p2_timer = newTimer();
        /* derived computed value test */
        // const control_timer = newObservable<string>('0');
        // p1_timer.observable.value.subscribe((value) => {
        //     control_timer.set(value + p2_timer.observable.value.get());
        // });
        // p2_timer.observable.value.subscribe((value) => {
        //     control_timer.set(p1_timer.observable.value.get() + value);
        // });
        const timer_context = newContext()
            .put('p1_timer', p1_timer.observable.value)
            .put('p2_timer', p2_timer.observable.value)
            .musterPins()
            .musterLinks()
            .activatePins()
            .activateLinks();
        //------------------------------------------------------ play_button
        const play_button = document.querySelector('button[name=play]');
        play_button.addEventListener('click', function (event) {
            p1_timer.toggle();
            p2_timer.toggle();
            event.stopPropagation();
        }, false);
        /**
         * @todo Render single component.
         * @todo Batch renders.
         */
    }); /* DOMContentLoaded */
})(); /* IIFE */
