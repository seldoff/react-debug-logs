import React, {useCallback} from 'react';
import ReactDOM from 'react-dom';
import {useState} from '../src/useStateWithLog';

const Counter = () => {
    const [counter, setCounter] = useState('counter', 0);
    const [history, setHistory] = useState<string[]>('history', []);

    const increase = useCallback(() => {
        setCounter((c) => c + 1);
        setHistory((h) => [...h, 'Increase']);
    }, []);

    const decrease = useCallback(() => {
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
