import {DependencyList, useCallback} from 'react';

export type UseCallbackLogger = (name: string, args: unknown[]) => void;

export const defaultLogger: UseCallbackLogger = (name: string, args: unknown[]) => {
    switch (args.length) {
        case 0: {
            console.log(`[${name}] called`);
            break;
        }
        case 1: {
            console.log(`[${name}] called with`, args[0]);
            break;
        }
        default: {
            console.log(`[${name}] called with`, args);
        }
    }
};

let _logger: UseCallbackLogger = defaultLogger;

export function setLogger(logger: UseCallbackLogger): void {
    _logger = logger;
}

export type Callback = (...args: any[]) => any;

export function logCallback<T extends Callback>(name: string, callback: T): T {
    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
    return useCallback<T>(
        ((...args: any[]) => {
            _logger(name, args);
            return callback(...args);
        }) as T,
        [callback, _logger]
    );
}

export function useCallbackLog<T extends Callback>(name: string, callback: T, deps: DependencyList): T {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return logCallback(name, useCallback(callback, deps));
}
