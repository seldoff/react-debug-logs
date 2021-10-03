import React from 'react';

export type PropsLogger = (name: string, props: unknown) => void;

export const defaultLogger: PropsLogger = (name: string, props: unknown) => {
    console.log(`[${name}] rendered with`, props);
};

let _logger: PropsLogger = defaultLogger;

export function setLogger(logger: PropsLogger): void {
    _logger = logger;
}

export function logProps<P>(name: string, component: React.FC<P>): React.FC<P> {
    const wrapped: React.FC<P> = (props: React.PropsWithChildren<P>, context?: any) => {
        _logger(name, props);
        return component(props, context);
    };

    wrapped.displayName = component.displayName || name;
    wrapped.defaultProps = component.defaultProps;
    wrapped.propTypes = component.propTypes;
    wrapped.contextTypes = component.contextTypes;

    return wrapped;
}
