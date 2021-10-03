import {useState} from 'react';
import {defaultLogger, logState, setLogger, useStateLog} from '../src/logState';
import {act, renderHook} from '@testing-library/react-hooks';

describe('defaultLogger', () => {
    it('should log to console', () => {
        // Can't check console output. Just check it didn't crash.

        expect(() => defaultLogger('state', 1, 2)).not.toThrow();
        expect(() => defaultLogger('state', undefined, 1)).not.toThrow();
        expect(() => defaultLogger('state', null, 1)).not.toThrow();
        expect(() => defaultLogger('state', 1, null)).not.toThrow();
        expect(() => defaultLogger('state', undefined, null)).not.toThrow();
    });
});

describe('logState', () => {
    let logs: {name: string; prev: unknown; next: unknown}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name, prev, next) => logs.push({name, prev, next}));
    });
    afterAll(() => setLogger(defaultLogger));

    it('should return same setter func', () => {
        const rendered = renderHook(() => logState('s', useState()));
        const setter1 = rendered.result.current[1];
        rendered.rerender();
        const setter2 = rendered.result.current[1];
        expect(setter1).toBe(setter2);
    });

    it('should not log on initial render', () => {
        renderHook(() => logState('s', useState()));
        expect(logs.length).toBe(0);
    });

    it('should support call without initial value', () => {
        const {result} = renderHook(() => logState('s', useState()));
        expect(result.current[0]).toBe(undefined);
    });

    it('should support call with initial value', () => {
        const {result} = renderHook(() => logState('s', useState(1)));
        expect(result.current[0]).toBe(1);
    });

    it('should support call with initial value factory', () => {
        const {result} = renderHook(() =>
            logState(
                's',
                useState(() => 1)
            )
        );
        expect(result.current[0]).toBe(1);
    });

    describe('set state from value', () => {
        it('should log state change', () => {
            const {result} = renderHook(() => logState('s', useState<number>()));
            act(() => result.current[1](1));
            act(() => result.current[1](2));
            expect(logs).toStrictEqual([
                {name: 's', prev: undefined, next: 1},
                {name: 's', prev: 1, next: 2},
            ]);
        });

        it('should not log state change if value is the same', () => {
            const {result} = renderHook(() => logState('s', useState<number>()));
            act(() => result.current[1](1));
            act(() => result.current[1](1));
            expect(logs).toStrictEqual([{name: 's', prev: undefined, next: 1}]);
        });
    });

    describe('set state from factory', function () {
        it('should log state change', () => {
            const {result} = renderHook(() => logState('s', useState<number>(1)));
            act(() => result.current[1]((x) => x + 1));
            act(() => result.current[1]((x) => x + 2));
            expect(logs).toStrictEqual([
                {name: 's', prev: 1, next: 2},
                {name: 's', prev: 2, next: 4},
            ]);
        });

        it('should not log state change if value is the same', () => {
            const {result} = renderHook(() => logState('s', useState<number>()));
            act(() => result.current[1](1));
            act(() => result.current[1]((x) => x));
            expect(logs).toStrictEqual([{name: 's', prev: undefined, next: 1}]);
        });
    });
});

describe('useStateLog', () => {
    let logs: {name: string; prev: unknown; next: unknown}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name, prev, next) => logs.push({name, prev, next}));
    });
    afterAll(() => setLogger(defaultLogger));

    it('should return same setter func', () => {
        const rendered = renderHook(() => useStateLog('s'));
        const setter1 = rendered.result.current[1];
        rendered.rerender();
        const setter2 = rendered.result.current[1];
        expect(setter1).toBe(setter2);
    });

    it('should not log on initial render', () => {
        renderHook(() => useStateLog('s'));
        expect(logs.length).toBe(0);
    });

    it('should support call without initial value', () => {
        const {result} = renderHook(() => useStateLog('s'));
        expect(result.current[0]).toBe(undefined);
    });

    it('should support call with initial value', () => {
        const {result} = renderHook(() => useStateLog('s', 1));
        expect(result.current[0]).toBe(1);
    });

    it('should support call with initial value factory', () => {
        const {result} = renderHook(() => useStateLog('s', () => 1));
        expect(result.current[0]).toBe(1);
    });

    describe('set state from value', () => {
        it('should log state change', () => {
            const {result} = renderHook(() => useStateLog<number>('s'));
            act(() => result.current[1](1));
            act(() => result.current[1](2));
            expect(logs).toStrictEqual([
                {name: 's', prev: undefined, next: 1},
                {name: 's', prev: 1, next: 2},
            ]);
        });

        it('should not log state change if value is the same', () => {
            const {result} = renderHook(() => useStateLog<number>('s'));
            act(() => result.current[1](1));
            act(() => result.current[1](1));
            expect(logs).toStrictEqual([{name: 's', prev: undefined, next: 1}]);
        });
    });

    describe('set state from factory', function () {
        it('should log state change', () => {
            const {result} = renderHook(() => useStateLog<number>('s', 1));
            act(() => result.current[1]((x) => x + 1));
            act(() => result.current[1]((x) => x + 2));
            expect(logs).toStrictEqual([
                {name: 's', prev: 1, next: 2},
                {name: 's', prev: 2, next: 4},
            ]);
        });

        it('should not log state change if value is the same', () => {
            const {result} = renderHook(() => useStateLog<number>('s'));
            act(() => result.current[1](1));
            act(() => result.current[1]((x) => x));
            expect(logs).toStrictEqual([{name: 's', prev: undefined, next: 1}]);
        });
    });
});
