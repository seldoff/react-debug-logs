/**
 * @jest-environment jsdom
 */

import React from 'react';
import {defaultLogger, logProps, setLogger} from '../src/logProps';
import {render} from '@testing-library/react';
import PropTypes from 'prop-types';

describe('defaultLogger', () => {
    it('should log to console', () => {
        // Can't check console output. Just check it didn't crash.
        expect(() => defaultLogger('Component', {})).not.toThrow();
        expect(() => defaultLogger('Component', {foo: 1, bar: 2})).not.toThrow();
    });
});

describe('logProps', () => {
    let logs: {name: string; props: unknown; context?: unknown}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name, props) => logs.push({name, props}));
    });
    afterAll(() => setLogger(defaultLogger));

    it('should log when component rendered with props only', () => {
        const Component = logProps('Component', (props: {prop: string}) => <span>{props.prop}</span>);
        const rendered = render(<Component prop="foo" />);
        rendered.rerender(<Component prop="bar" />);
        expect(logs).toStrictEqual([
            {name: 'Component', props: {prop: 'foo'}},
            {name: 'Component', props: {prop: 'bar'}},
        ]);
    });

    it('should copy properties from component', () => {
        const Component: React.FC<{text: string}> = (props: {text: string}) => <span>{props.text}</span>;
        Component.defaultProps = {text: 'default'};
        Component.displayName = 'displayName';
        Component.propTypes = {
            text: PropTypes.string.isRequired,
        };
        Component.contextTypes = {};

        const Wrapped = logProps('Component', Component);
        expect(Wrapped.defaultProps).toBe(Component.defaultProps);
        expect(Wrapped.displayName).toBe(Component.displayName);
        expect(Wrapped.propTypes).toBe(Component.propTypes);
        expect(Wrapped.contextTypes).toBe(Component.contextTypes);
    });

    it('should pass props to component', () => {
        const Component: React.FC<{text: string}> = (props: {text: string}) => <span>{props.text}</span>;
        const Wrapped = logProps('Component', Component);
        const rendered = render(<Wrapped text="foo" />);
        expect(rendered.baseElement.textContent).toBe('foo');
    });
});
