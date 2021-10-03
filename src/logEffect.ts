import {useCallback, useEffect} from 'react';

export type UseEffectLogger = (name: string) => void;

export const defaultLogger: UseEffectLogger = (name: string) => {
    console.log(`[${name}] effect executed`);
};

let _logger: UseEffectLogger = defaultLogger;

export function setLogger(logger: UseEffectLogger): void {
    _logger = logger;
}

export type EffectCallback = () => void | (() => void);

export function logEffect(name: string, callback: EffectCallback): EffectCallback {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(() => {
        _logger(name);
        return callback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, _logger, name]);
}

export function useEffectLog(name: string, callback: EffectCallback, deps?: unknown[]): void {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(logEffect(name, callback), deps);
}
