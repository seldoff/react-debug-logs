import {renderHook} from '@testing-library/react-hooks';
import {defaultLogger, logEffect, setLogger, useEffectLog} from '../src/logEffect';
import {useEffect} from 'react';

describe('defaultLogger', () => {
    it('should log to console', () => {
        // Can't check console output. Just check it didn't crash.
        expect(() => defaultLogger('effect')).not.toThrow();
    });
});

describe('logEffect', () => {
    let logs: {name: string}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name) => logs.push({name}));
    });
    afterAll(() => setLogger(defaultLogger));

    it('should log when effect executed', () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const rendered = renderHook(() => useEffect(logEffect('effect', () => {})));
        rendered.rerender();
        expect(logs).toStrictEqual([{name: 'effect'}, {name: 'effect'}]);
    });
});

describe('useEffectLog', () => {
    let logs: {name: string}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name) => logs.push({name}));
    });
    afterAll(() => setLogger(defaultLogger));

    it('should log when effect executed', () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const rendered = renderHook(() => useEffectLog('effect', () => {}));
        rendered.rerender();
        expect(logs).toStrictEqual([{name: 'effect'}, {name: 'effect'}]);
    });
});
