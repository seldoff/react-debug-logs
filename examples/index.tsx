import React, {useCallback, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {logState} from '../src/logState';
import {logCallback} from '../src/logCallback';
import {logEffect} from '../src/logEffect';
import {logProps} from '../src/logProps';

const CounterDisplay = logProps('CounterDisplay', (props: {counter: number}) => <span>{props.counter}</span>);

const Counter = () => {
    const [counter, setCounter] = logState('counter', useState(0));
    const [history, setHistory] = logState('history', useState<string[]>([]));

    const increase = logCallback(
        'increase',
        useCallback(() => {
            setCounter((c) => c + 1);
            setHistory((h) => [...h, 'Increase']);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    const decrease = logCallback(
        'decrease',
        useCallback(() => {
            setCounter((c) => c - 1);
            setHistory((h) => [...h, 'Decrease']);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(
        logEffect('counter effect', () => {}),
        [counter]
    );

    return (
        <div>
            <div>Click on the buttons and observe state changes in the developer console.</div>
            <p />
            <CounterDisplay counter={counter} />
            &nbsp;
            <button onClick={increase}>Increase</button>&nbsp;
            <button onClick={decrease}>Decrease</button>
            {history.map((a, i) => (
                <div key={i}>{a}</div>
            ))}
        </div>
    );
};

ReactDOM.render(<Counter />, document.querySelector('#root'));
