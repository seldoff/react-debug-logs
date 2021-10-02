import React from 'react';
import ReactDOM from 'react-dom';
import {useState} from '../src/useStateWithLog';
import {useCallback} from '../src/useCallbackWithLog';

const Counter = () => {
    const [counter, setCounter] = useState('counter', 0);
    const [history, setHistory] = useState<string[]>('history', []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const increase = useCallback('increase', () => {
        setCounter((c) => c + 1);
        setHistory((h) => [...h, 'Increase']);
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const decrease = useCallback('decrease', () => {
        setCounter((c) => c - 1);
        setHistory((h) => [...h, 'Decrease']);
    }, []);

    return (
        <div>
            <div>Click on the buttons and observe state changes in the developer console.</div>
            <p/>
            {counter}&nbsp;
            <button onClick={increase}>Increase</button>&nbsp;
            <button onClick={decrease}>Decrease</button>

            {history.map((a, i) => (
                <div key={i}>{a}</div>
            ))}
        </div>
    );
};

ReactDOM.render(<Counter />, document.querySelector('#root'));
