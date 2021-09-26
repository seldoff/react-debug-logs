import {Dispatch, SetStateAction, useState as useStateOrig} from 'react';

export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
export function useState<S>(initialState?: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
    return useStateOrig<S>(initialState as any);
}