import {Dispatch, SetStateAction, useCallback, useState as useStateOrig} from 'react';

export type UseStateLogger = (name: string, prev: unknown, next: unknown) => void;

export const defaultLogger: UseStateLogger = (name: string, prev: unknown, next: unknown) => {
    console.log(`[${name}]:`, prev, '→', next);
};

let _logger: UseStateLogger = defaultLogger;

export function setLogger(logger: UseStateLogger): void {
    _logger = logger;
}

export function useState<S>(name: string, initialState?: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
    const [state, setState] = useStateOrig<S>(initialState as any);

    const setStateWithLogging = useCallback<Dispatch<SetStateAction<S>>>(
        (state) => {
            setState((prevState) => {
                if (typeof state === 'function') {
                    const callable = state as (prevState: S) => S;
                    const nextState = callable(prevState);
                    if (prevState !== nextState) {
                        _logger(name, prevState, nextState);
                    }
                    return nextState;
                } else {
                    if (prevState !== state) {
                        _logger(name, prevState, state);
                    }
                    return state;
                }
            });
        },
        // react-hooks/exhaustive-deps complains about _logger being unnecessary. I disagree.
        // If logger changes we should return a new setter func to the hook user.
        [name, _logger, setState],
    );

    return [state, setStateWithLogging];
}
