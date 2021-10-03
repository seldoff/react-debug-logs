import {useCallback} from 'react';
import {defaultLogger, logCallback, setLogger, useCallbackLog} from '../src/logCallback';
import {renderHook} from '@testing-library/react-hooks';

describe('defaultLogger', () => {
    it('should log to console', () => {
        expect(() => defaultLogger('cb', [])).not.toThrow();
        expect(() => defaultLogger('cb', [1])).not.toThrow();
        expect(() => defaultLogger('cb', [1, undefined, null])).not.toThrow();
    });
});

describe('logCallback', () => {
    let logs: {name: string; args: unknown[]}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name, args) => logs.push({name, args}));
    });
    afterAll(() => setLogger(defaultLogger));

    it("should return same callback if deps didn't change", () => {
        const rendered = renderHook(() =>
            logCallback(
                'c',
                useCallback(() => {}, [])
            )
        );
        const cb1 = rendered.result.current;
        rendered.rerender();
        const cb2 = rendered.result.current;
        expect(cb1).toBe(cb2);
    });

    it("should call callback and return it's value", () => {
        const rendered = renderHook(() =>
            logCallback(
                'c',
                useCallback((x: number) => x + 1, [])
            )
        );
        expect(rendered.result.current(1)).toBe(2);
    });

    it('should call callback with several arguments', () => {
        const rendered = renderHook(() =>
            logCallback(
                'c',
                useCallback((x: number, y: number) => x + y, [])
            )
        );
        expect(rendered.result.current(1, 2)).toBe(3);
    });

    it('should write to log when callback is called', () => {
        const rendered = renderHook(() =>
            logCallback(
                'c',
                useCallback((x: number) => x, [])
            )
        );
        rendered.result.current(1);
        expect(logs).toStrictEqual([{name: 'c', args: [1]}]);
    });
});

describe('useCallbackLog', () => {
    let logs: {name: string; args: unknown[]}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name, args) => logs.push({name, args}));
    });
    afterAll(() => setLogger(defaultLogger));

    it("should return same callback if deps didn't change", () => {
        const rendered = renderHook(() => useCallbackLog('c', () => {}, []));
        const cb1 = rendered.result.current;
        rendered.rerender();
        const cb2 = rendered.result.current;
        expect(cb1).toBe(cb2);
    });

    it("should call callback and return it's value", () => {
        const rendered = renderHook(() => useCallbackLog('c', (x: number) => x + 1, []));
        expect(rendered.result.current(1)).toBe(2);
    });

    it('should call callback with several arguments', () => {
        const rendered = renderHook(() => useCallbackLog('c', (x: number, y: number) => x + y, []));
        expect(rendered.result.current(1, 2)).toBe(3);
    });

    it('should write to log when callback is called', () => {
        const rendered = renderHook(() => useCallbackLog('c', (x: number) => x, []));
        rendered.result.current(1);
        expect(logs).toStrictEqual([{name: 'c', args: [1]}]);
    });
});
