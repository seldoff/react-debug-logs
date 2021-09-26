import {Dispatch, SetStateAction, useCallback, useState as useStateOrig} from 'react';

export type UseStateLogger = (name: string, prev: unknown, next: unknown) => void;

const defaultLogger: UseStateLogger = (name: string, prev: unknown, next: unknown) => {
    console.log(`[${name}]:`, prev, '→', next);
}

let _logger: UseStateLogger = defaultLogger;

export function setLogger(logger: UseStateLogger): void {
    _logger = logger;
}

export function useState<S = undefined>(name: string): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export function useState<S>(name: string, initialState?: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
    _logger(name,null, null);
    const [state, setState] = useStateOrig<S>(initialState as any);

    const setStateWithLogging = useCallback<Dispatch<SetStateAction<S>>>((state) => {
        setState(prevState => {
            if (typeof state === 'function') {
                const callable = state as (prevState: S) => S;
                const nextState = callable(prevState);
                _logger(name, prevState, nextState);
                return nextState;
            } else {
                _logger(name, prevState, state);
                return state;
            }
        });
    }, [name]);

    return [state, setStateWithLogging];
}