import {DependencyList, useCallback as useCallbackOrig} from 'react';

export type UseCallbackLogger = (name: string, args: unknown[]) => void;

export const defaultLogger: UseCallbackLogger = (name: string, args: unknown[]) => {
    console.log(`[${name}] called:`, args);
};

let _logger: UseCallbackLogger = defaultLogger;

export function setLogger(logger: UseCallbackLogger): void {
    _logger = logger;
}

export function useCallback<T extends (...args: any[]) => any>(name: string, callback: T, deps: DependencyList): T {
    return useCallbackOrig<T>(
        ((...args: any[]) => {
            _logger(name, args);
            return callback(...args);
        }) as T,
        deps,
    );
}
