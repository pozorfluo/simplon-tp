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
        () => (node[property] = observable.value));
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
        };
        return context;
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
    function musterPins(context) {
        const pin_nodes = [...document.querySelectorAll('[data-pin]')];
        const length = pin_nodes.length;
        const pins = Array(length);
        for (let i = 0; i < length; i++) {
            const source = pin_nodes[i].getAttribute('data-pin');
            const target = pin_nodes[i].getAttribute('data-property');
            const type = pin_nodes[i].getAttribute('data-type');
            pins[i] = {
                source: context.observables[source] !== undefined
                    ? context.observables[source]
                    : source,
                target: target !== null ? target : 'value',
                type: type !== null ? type : 'string',
                node: pin_nodes[i],
            };
        }
        return pins;
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
    function musterLinks(context) {
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
                source: context.observables[source] !== undefined
                    ? context.observables[source]
                    : source,
                target: target !== null ? target : 'value',
                event: event !== null ? event : 'input',
                type: type !== null ? type : 'string',
                node: link_nodes[i],
            };
        }
        return links;
    }
    /**
     * Activate a given pin collection.
     *
     * @todo Deal with incomple Observable-less pins
     * @todo Consider making it a method of Context object.
     */
    function activatePins(pins) {
        for (let i = 0, length = pins.length; i < length; i++) {
            if (typeof pins[i].source !== 'string') {
                pins[i].source.subscribe((value) => (pins[i].node[pins[i].target] = value));
            }
        }
    }
    /**
     * Activate a given pin collection.
     *
     * @todo Deal with incomple Observable-less pins
     * @todo Consider making it a method of Context object.
     */
    function activateLinks(links) {
        for (let i = 0, length = links.length; i < length; i++) {
            if (typeof links[i].source !== 'string') {
                link(links[i].source, links[i].node, links[i].target, links[i].event);
            }
        }
    }
    /**
     * Create new Timer object.
     */
    function newTimer() {
        const timer = {
            id: 0,
            elapsed: 0,
            // start: start_time !== undefined ? start_time : Date.now(),
            start: 0,
            // observable : {
            //     value : newObservable<string>('')
            // },
            tag: function () {
                const formatted_time = new Date(Date.now() - this.start + this.elapsed)
                    .toISOString()
                    .slice(11, -5);
                // console.log(formatted_time);
                // console.log(this.start);
                this.observable.value.set('time elapsed : ' + formatted_time);
                return this;
            },
            toggle: function () {
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
                    this.id = setInterval(function () {
                        that.tag();
                    }, 1000);
                }
                else {
                    clearInterval(this.id);
                    this.elapsed = Date.now() - this.start;
                    this.id = 0;
                }
                return this;
            },
            reset: function () {
                this.elapsed = 0;
                this.start = Date.now();
                return this;
            },
            syncWith: function (another_timer) {
                this.id = another_timer.id;
                this.elapsed = another_timer.elapsed;
                this.start = another_timer.start;
                this.tag();
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
        //------------------------------------------ subscribing and linking
        // const global_timer = newObservable<string>('init');
        // const p1_timer = newObservable<string>('init');
        // const p2_timer = newObservable<string>('init');
        const global_timer = newTimer();
        // const p1_timer = newTimer().syncWith(global_timer);
        // const p2_timer = newTimer().syncWith(global_timer);
        console.log(global_timer);
        global_timer;
        const timer_context = newContext().put('global_timer', global_timer.observable.value);
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
        play_button.addEventListener('click', function (event) {
            console.log(global_timer);
            global_timer.toggle();
            event.stopPropagation();
        }, false);
        /**
         * @todo Render single component.
         * @todo Batch renders.
         */
    }); /* DOMContentLoaded */
})(); /* IIFE */
