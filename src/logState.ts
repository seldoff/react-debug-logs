import {Dispatch, SetStateAction, useCallback, useState} from 'react';

export type UseStateLogger = (name: string, prev: unknown, next: unknown) => void;

export const defaultLogger: UseStateLogger = (name: string, prev: unknown, next: unknown) => {
    console.log(`[${name}] changed:`, prev, '→', next);
};

let _logger: UseStateLogger = defaultLogger;

export function setLogger(logger: UseStateLogger): void {
    _logger = logger;
}

export type UseStateTuple<S> = [S, Dispatch<SetStateAction<S>>];

export function logState<S>(name: string, stateTuple: UseStateTuple<S>): UseStateTuple<S> {
    const [state, setState] = stateTuple;

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [name, _logger, setState]
    );

    return [state, setStateWithLogging];
}

export function useStateLog<S>(name: string, initialState?: S | (() => S)): UseStateTuple<S> {
    // Cast to `any` required because our signature for initialState `S | (() => S) | undefined` is not compatible with any
    // of two useState overloads defined in `react/index.d.ts`.
    return logState(name, useState<S>(initialState as any));
}
