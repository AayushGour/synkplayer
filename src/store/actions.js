// Define all actions
import * as RNFS from 'react-native-fs';
import { DISPLAY_LOADER, DISPLAY_PLAYER, SET_ALL_FILES, SET_MODAL_CONTENT } from './action-types';
import store from './store';

export var allFileArray = [];
let timeout = null;

const proxyHandler = {
    get(target, property, receiver) {
        !!timeout && clearTimeout(timeout)
        timeout = setTimeout(() => {
            store.dispatch(dispatchAllFiles(allFileArray));
            store.dispatch(toggleLoader(false))
        }, 1000);
        return target[property];
    }
}

const proxy = new Proxy(allFileArray, proxyHandler)

const dispatchAllFiles = (allfiles) => {
    console.log("all Files", allfiles)
    return {
        type: SET_ALL_FILES,
        payload: allfiles
    }
}

export const toggleLoader = (value) => {
    return ({ type: DISPLAY_LOADER, payload: value });
}
export const togglePlayer = (value) => {
    return ({ type: DISPLAY_PLAYER, payload: value });
}

export const setModalContent = (modalContent) => {
    return ({ type: SET_MODAL_CONTENT, payload: modalContent });
}
export const resetModalContent = () => {
    return ({ type: SET_MODAL_CONTENT, payload: { visible: false } });
}


export const getFiles = async (path) => {
    await RNFS.readDir(path).then(result => {
        result.map(element => {
            if (element?.name?.endsWith(".mp3")) {
                proxy.push({
                    title: element.name,
                    path: element.path,
                    cTime: element.ctime
                })
            } else if (element?.isDirectory()) {
                getFiles(element.path);
            }
        })
    });
}