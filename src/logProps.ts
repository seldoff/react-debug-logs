import React, {ExoticComponent} from 'react';

export type PropsLogger = (name: string, props: unknown) => void;

export const defaultLogger: PropsLogger = (name: string, props: unknown) => {
    console.log(`[${name}] rendered with`, props);
};

let _logger: PropsLogger = defaultLogger;

export function setLogger(logger: PropsLogger): void {
    _logger = logger;
}

export function logProps<P>(name: string, component: React.FC<P>): React.FC<P> {
    const typeOf = (component as ExoticComponent).$$typeof;
    if (typeof typeOf === 'symbol' && typeOf.description === 'react.memo') {
        console.warn(
            `[react-debug-logs]: React.memo component is wrapped with logProps('${name}'). This is not supported. Please do this other way, wrap component with logProps and then with React.memo: React.memo(logProps('${name}', Component)).`
        );
        return component;
    } else {
        const wrapped = wrapComponent(name, component);

        wrapped.displayName = component.displayName || name;
        wrapped.defaultProps = component.defaultProps;
        wrapped.propTypes = component.propTypes;
        wrapped.contextTypes = component.contextTypes;

        return wrapped;
    }
}

function wrapComponent<P>(name: string, component: React.FunctionComponent<P>) {
    const wrapped: React.FC<P> = (props: React.PropsWithChildren<P>, context?: any) => {
        _logger(name, props);
        return component(props, context);
    };
    return wrapped;
}
