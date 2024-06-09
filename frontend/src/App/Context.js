import {createContext} from 'react';

export const indexContext = createContext({
	index: 0,
	setIndex: (i)=>{}
});

export const stateContext = createContext({
    state: {
        canvasList: [],
		title: '',
		id: null, // id of current (opened) scatch. null means new scatch.
    },
    setState: (i)=>{}
});

export const canvasContext = createContext({
    tmpCanvas: null,
    setTmpCanvas: (i)=>{}
});

export const globalCanvasContext = createContext({
    canvas: null,
    setCanvas: (i)=>{}
});