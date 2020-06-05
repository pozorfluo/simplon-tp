(function () {
    'use strict';
    //---------------------------------------------------------------- komrad.ts
    /**
     * Manifesto for classless object composition.
     */
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

    //------------------------------------------------------------------ odno.ts
    /**
     * Single-page party system !
     */

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
        notify: () => Promise<this>;
        subscribe: (
            subscriber: Subscriber<T>,
            priority?: number
        ) => this;
        // unsubscribe: (subscriber: Subscriber<T>) => void;
        flush: () => this;
        get: () => T;
        set: (value: T) => this;
        [extension: string]: any; // open for extension.
    }

    /**
     * Create a new Observable object.
     *
     * @note Optional parameter priority in subscribe method is the index where
     *       given Subscriber is going to be 'spliced' in the subscribers list.
     *       If no paramater is supplied, given Subscriber is appended.
     * 
     * @note To resolve notifications according to subscribers priority and 
     *       insertion order, notify() Awaits each subscriber's callback in 
     *       turn.                                                
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

            notify: async function (): Promise<Observable<T>> {
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
                return this;
            },

            subscribe: function (
                subscriber: Subscriber<T>,
                priority?: number
            ): Observable<T> {
                if (priority === undefined) {
                    this.subscribers.push(subscriber);
                } else {
                    this.subscribers.splice(priority, 0, subscriber);
                }
                return this;
            },

            flush: function (): Observable<T> {
                this.subscribers = [];
                return this;
            },

            get: function (): T {
                /* Notify that a read is happening here if necessary. */
                return this.value;
            },

            set: function (value: T): Observable<T> {
                /* The buck stops here. */
                if (value !== this.value) {
                    this.value = value;
                    this.notify();
                }
                return this;
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
     *       does not need to be notified back/updated if it is its only
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
            () => {
                node[property] = observable.value;
            }
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
     * @todo Add deactivatePins method.
     * @todo Add deactivateLinks method.
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
        setPins: (pins: Pin<any>[]) => this;
        setLinks: (links: Link<any>[]) => this;
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

            /**
             * Merge observables from another given context.
             */
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
             * Collect data pins declared in the DOM for this Context.
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
             * Collect data links declared in the DOM for this Context.
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
             * Reference given pin collection as this context pin collection.
             */
            setPins: function (pins: Pin<any>[]): Context {
                this.pins = pins;
                return this;
            },
            /**
             * Reference given link collection as this context link collection.
             */
            setLinks: function (links: Link<any>[]): Context {
                this.links = links;
                return this;
            },
            /**
             * Activate this context pin collection.
             *
             * @todo Deal with incomple Observable-less pins.
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
                        )).subscribe((value) => {
                            this.pins[i].node[
                                this.pins[i].target
                            ] = value;
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
        // sync: Timer | undefined;
        readonly observable: { value: Observable<string> };
        tag: () => this; // template: TemplateStringsArray
        toggle: () => this;
        reset: () => this;
        syncWith: (ref_timer: Timer) => this;
        isOn: () => boolean;
        [extension: string]: any; // open for extension.
    }

    /**
     * Create new Timer object.
     */
    function newTimer(): Timer & Observable<string> {
        const timer: any = {
            id: 0,
            elapsed: 0,
            start: 0,
            // sync: undefined,
            tag: function (): Timer {
                const formatted_time = new Date(
                    performance.now() - this.start + this.elapsed
                )
                    .toISOString()
                    .slice(11, -5);
                this.observable.value.set(formatted_time);
                return this;
            },
            toggle: function (): Timer {
                if (this.id === 0) {
                    this.start = performance.now();
                    const that = this;
                    this.id = setInterval(function (): void {
                        that.tag();
                    }, 500);
                } else {
                    clearInterval(this.id);
                    this.tag();
                    this.elapsed += performance.now() - this.start;
                    this.id = 0;
                }
                return this;
            },
            reset: function (): Timer {
                if (this.id !== 0) {
                    clearInterval(this.id);
                    this.id = 0;
                }
                this.elapsed = 0;
                this.start = performance.now();
                this.tag();
                return this;
            },
            syncWith: function (another_timer: Timer): Timer {
                this.elapsed = another_timer.elapsed;
                this.start = another_timer.start;
                this.tag();
                // this.sync = ref_timer;
                return this;
            },
            isOn: function (): boolean {
                return !(this.id === 0);
            },
        };
        extend(timer, withObservable<string>('value', ''));
        return <Timer & Observable<string>>timer;
    }

    /**
     * Define Turn enum.
     */
    const enum Turn {
        x = 'x',
        o = 'o',
        win = 'w',
        draw = 'd',
    }

    /**
     * Define Board object.
     */
    interface Board {
        x: Observable<number>;
        o: Observable<number>;
        turn: Observable<Turn>;
        draw: number;
        wins: number[];
        check: () => this;
        play: (position: number) => this;
        reset: () => this;
        [extension: string]: any; // open for extension.
    }

    /**
     * Create new Board object.
     */
    function newBoard(): Board {
        const board: Board = {
            x: newObservable<number>(0b000000000),
            o: newObservable<number>(0b000000000),
            turn: newObservable<Turn>(Turn.x),
            draw: 0b111111111,
            wins: [
                0b111000000, // horizontal
                0b000111000, // horizontal
                0b000000111, // horizontal
                0b100100100, // vertical
                0b010010010, // vertical
                0b001001001, // vertical
                0b100010001, // diagonal
                0b001010100, // diagonal
            ],

            check: function (): Board {
                /* Win ? */
                for (let condition of this.wins) {
                    if (
                        (this[this.turn.value].value & condition) ===
                        condition
                    ) {
                        this.turn.set(Turn.win);
                        return this;
                    }
                }
                /* Draw ? */
                if ((this.x.value | this.o.value) === this.draw) {
                    this.turn.set(Turn.draw);
                    return this;
                }
                /* Next turn ! */
                this.turn.set(
                    this.turn.value === Turn.x ? Turn.o : Turn.x
                );
                return this;
            },
            play: function (position: number): Board {
                if (
                    this.turn.value === Turn.x ||
                    this.turn.value === Turn.o
                ) {
                    const mask = 1 << position;
                    if (
                        !(this.x.value & mask) &&
                        !(this.o.value & mask)
                    ) {
                        this[this.turn.value].set(
                            this[this.turn.value].value | mask
                        );
                        return this.check();
                    }
                }
                return this;
            },
            reset: function (): Board {
                this.x.set(0b000000000);
                this.o.set(0b000000000);
                this.turn.set(Turn.x);
                return this;
            },
        };
        return board;
    }

    //----------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (
        event: Event
    ) {
        const timer_x = newTimer().toggle();
        const timer_o = newTimer();
        const board = newBoard();

        const view_context = newContext();
        for (let i = 0; i < 9; i++) {
            const name = i.toString();
            view_context.put(name, newObservable<string>(name));
        }

        const board_context = newContext()
            .put('timer_x', timer_x.observable.value)
            .put('timer_o', timer_o.observable.value)
            .put('board_x', board.x)
            .put('board_o', board.o)
            .put('turn', board.turn)
            .merge(view_context)
            .musterPins()
            .activatePins();
        /* No links used for this game */
        // .musterLinks()
        // .activateLinks();

        const timer_x_container = document.querySelector('.timer-x');
        const timer_o_container = document.querySelector('.timer-o');

        /**
         * Translate board state to observable view context.
         *
         * @todo Update diff subscriber only, even if setting an observable to
         *       its current value does not cause further notify calls.
         */
        const boardView = function (value: number): void {
            const x = board.x.value;
            const o = board.o.value;
            for (let i = 0; i < 9; i++) {
                const mask = 1 << i;
                const name = i.toString();
                if (x & mask) {
                    view_context.observables[name].set('X');
                } else {
                    if (o & mask) {
                        view_context.observables[name].set('O');
                    } else {
                        view_context.observables[name].set('');
                    }
                }
            }
        };
        /**
         * Add Board state subscriber to refresh view.
         */
        board_context.observables.board_x.subscribe(boardView);
        board_context.observables.board_o.subscribe(boardView);

        /**
         * Add turn subscriber to toggle timers.
         */
        board_context.observables.turn.subscribe((value) => {
            let msg = '';
            switch (value) {
                case Turn.x:
                case Turn.o:
                    timer_x.toggle();
                    timer_o.toggle();
                    timer_x_container.classList.toggle('active');
                    timer_o_container.classList.toggle('active');
                    return;
                case Turn.draw:
                    msg = ': Draw game !';
                    break;
                case Turn.win:
                    msg = 'wins !';
                    break;
                default:
                    msg = ': something weird happened !';
                    break;
            }
            if (timer_x.isOn()) {
                timer_x.toggle();
                timer_x.observable.value.set(msg);
            }
            if (timer_o.isOn()) {
                timer_o.toggle();
                timer_o.observable.value.set(msg);
            }
        });

        //------------------------------------------------------------- grid
        const squares = [...document.querySelectorAll('.square')];
        for (let i = 0, length = squares.length; i < length; i++) {
            squares[i].addEventListener(
                'mousedown',
                function (event) {
                    board.play(i);
                },
                false
            );
        }

        //------------------------------------------------------ reset_button
        const reset_button = document.querySelector(
            'button[name=reset]'
        );
        reset_button.addEventListener(
            'click',
            function (event: Event): void {
                board.reset();
                timer_x.reset().toggle();
                timer_o.reset();
                timer_x_container.classList.add('active');
                timer_o_container.classList.remove('active');
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
