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
                console.log(this.subscribers);
                for (let i = 0, length = this.subscribers.length; i < length; i++) {
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
        console.log(arguments);
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
     * @todo Consider make it a Context method.
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
     * Activate a given pin collection.
     *
     * @todo Deal with incomple Observable-less pins
     */
    function activatePins(pins) {
        for (let i = 0, length = pins.length; i < length; i++) {
            if (typeof pins[i].source !== 'string') {
                pins[i].source.subscribe((value) => (pins[i].node[pins[i].target] = value));
            }
        }
    }
    //------------------------------------------------------------------- main ---
    /**
     * DOMContentLoaded loaded !
     */
    window.addEventListener('DOMContentLoaded', function (event) {
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
        const observable_state = newObservable('init');
        // 1-way
        observable_state.subscribe((value) => (timer.textContent = value));
        // 2-way link
        link(observable_state, input);
        link(observable_state, output, 'value', 'change');
        const start = Date.now();
        setInterval(tick, 1000, observable_state, start);
        const base_object = extendCopy({}, withObservable('observable_extension', 'notice me !'));
        console.log(base_object);
        cram(base_object, withObservable('another_observe', 'let me in'));
        console.log(base_object);
        cram(base_object, withObservable('yet_another', 'make some room'));
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
