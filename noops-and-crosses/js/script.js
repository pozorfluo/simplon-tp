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
                return this;
            },
            subscribe: function (subscriber, priority) {
                if (priority === undefined) {
                    this.subscribers.push(subscriber);
                }
                else {
                    this.subscribers.splice(priority, 0, subscriber);
                }
                return this;
            },
            flush: function () {
                this.subscribers = [];
                return this;
            },
            get: function () {
                /* Notify that a read is happening here if necessary. */
                return this.value;
            },
            set: function (value) {
                /* The buck stops here. */
                if (value !== this.value) {
                    this.value = value;
                    this.notify();
                }
                return this;
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
        () => {
            node[property] = observable.value;
        });
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
            /**
             * Merge observables from another given context.
             */
            merge: function (another_context) {
                if (another_context.observables !== undefined) {
                    another_context = another_context.observables;
                }
                extend(this.observables, another_context);
                return this;
            },
            /**
             * Collect data pins declared in the DOM for this Context.
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
             * Collect data links declared in the DOM for this Context.
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
             * Reference given pin collection as this context pin collection.
             */
            setPins: function (pins) {
                this.pins = pins;
                return this;
            },
            /**
             * Reference given link collection as this context link collection.
             */
            setLinks: function (links) {
                this.links = links;
                return this;
            },
            /**
             * Activate this context pin collection.
             *
             * @todo Deal with incomple Observable-less pins.
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
             * Activate this context link collection.
             *
             * @todo Deal with incomple Observable-less links.
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
                if (this.id !== 0) {
                    clearInterval(this.id);
                    this.id = 0;
                }
                this.elapsed = 0;
                this.start = performance.now();
                this.tag();
                return this;
            },
            syncWith: function (another_timer) {
                this.elapsed = another_timer.elapsed;
                this.start = another_timer.start;
                this.tag();
                // this.sync = ref_timer;
                return this;
            },
            isOn: function () {
                return !(this.id === 0);
            },
        };
        extend(timer, withObservable('value', ''));
        return timer;
    }
    /**
     * Create new Board object.
     */
    function newBoard() {
        const board = {
            x: 0b000000000,
            o: 0b000000000,
            turn: 'x',
            draw: 0b111111111,
            wins: [
                0b111000000,
                0b000111000,
                0b000000111,
                0b100100100,
                0b010010010,
                0b001001001,
                0b100010001,
                0b001010100,
            ],
            check: function () {
                /* Win ? */
                for (let condition of this.wins) {
                    if ((this[this.turn] & condition) === condition) {
                        console.log(this.turn + ' won ! ');
                        return this;
                    }
                }
                /* Draw ? */
                if ((this.x | this.o) === this.draw) {
                    console.log('Draw !');
                    return this;
                }
                /* Next turn !*/
                this.turn = this.turn === 'x' ? 'o' : 'x';
                return this;
            },
            play: function (position) {
                const mask = 1 << position;
                if (!(this.x & mask) && !(this.o & mask)) {
                    this[this.turn] |= mask;
                    console.log(this.turn + ' : ' + this[this.turn]);
                    return this.check();
                }
                return this;
            },
            reset: function () {
                this.x = 0b000000000;
                this.o = 0b000000000;
                this.turn = 'x';
                this.observable.x.set(this.x);
                this.observable.o.set(this.o);
                this.observable.turn.set(this.turn);
                return this;
            },
        };
        extend(board, withObservable('x', 0b000000000));
        extend(board, withObservable('o', 0b000000000));
        extend(board, withObservable('turn', 'x'));
        return board;
    }
    //----------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (event) {
        //----------------------------------------------------------- timers
        const timer_x = newTimer();
        const timer_o = newTimer();
        const board = newBoard();
        /* derived computed value test */
        // const control_timer = newObservable<string>('0');
        // p1_timer.observable.value.subscribe((value) => {
        //     control_timer.set(value + p2_timer.observable.value.get());
        // });
        // p2_timer.observable.value.subscribe((value) => {
        //     control_timer.set(p1_timer.observable.value.get() + value);
        // });
        const board_context = newContext()
            .put('timer_x', timer_x.observable.value)
            .put('timer_o', timer_o.observable.value)
            .put('board_x', board.observable.x)
            .put('board_o', board.observable.o)
            .put('turn', board.observable.turn)
            .musterPins()
            .activatePins();
        // .musterLinks()
        // .activateLinks();
        //------------------------------------------------------------ board
        //------------------------------------------------------------- grid
        const squares = [...document.querySelectorAll('.square')];
        for (let i = 0, length = squares.length; i < length; i++) {
            squares[i].addEventListener('click', function (event) {
                board.play(i);
            }, false);
        }
        //------------------------------------------------------ reset_button
        const reset_button = document.querySelector('button[name=reset]');
        reset_button.addEventListener('click', function (event) {
            board.reset();
            timer_x.reset().toggle();
            timer_o.reset();
            // console.log('x timer is on : ' + timer_x.isOn());
            // console.log('o timer is on : ' + timer_o.isOn());
            // p1_timer.toggle();
            // p2_timer.toggle();
            // timer_context.pins[0].node.classList.toggle('active');
            // timer_context.pins[1].node.classList.toggle('active');
            event.stopPropagation();
        }, false);
        /**
         * @todo Render single component.
         * @todo Batch renders.
         */
    }); /* DOMContentLoaded */
})(); /* IIFE */
