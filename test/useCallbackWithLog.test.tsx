import {defaultLogger, setLogger, useCallback} from '../src/useCallbackWithLog';
import {renderHook} from '@testing-library/react-hooks';

describe('defaultLogger', () => {
    it('should log to console', () => {
        expect(() => defaultLogger('cb', [])).not.toThrow();
        expect(() => defaultLogger('cb', [1])).not.toThrow();
        expect(() => defaultLogger('cb', [1, undefined, null])).not.toThrow();
    });
});

describe('useCallback', () => {
    let logs: {name: string; args: unknown[]}[] = [];
    beforeEach(() => {
        logs = [];
        setLogger((name, args) => logs.push({name, args}));
    });
    afterAll(() => setLogger(defaultLogger));

    it("should return same callback if deps didn't change", () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const rendered = renderHook(() => useCallback('s', () => {}, []));
        const cb1 = rendered.result.current;
        rendered.rerender();
        const cb2 = rendered.result.current;
        expect(cb1).toBe(cb2);
    });
});
