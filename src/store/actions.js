// Define all actions
import * as RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';
import { DISPLAY_LOADER, DISPLAY_PLAYER, SET_ALL_FILES, SET_CURRENT_TRACK, SET_MODAL_CONTENT, SET_SELECTED_FILES } from './action-types';
import store from './store';

export var allFileArray = [];
let timeout = null;

const proxyHandler = {
    get(target, property, receiver) {
        !!timeout && clearTimeout(timeout)
        timeout = setTimeout(async () => {
            store.dispatch(dispatchAllFiles(allFileArray));
            store.dispatch(toggleLoader(false));
            await TrackPlayer.reset();
            await TrackPlayer.add(allFileArray);
            // await TrackPlayer.getQueue().then(r => console.log("after adding tracs", r))
        }, 1000);
        return target[property];
    }
}

const proxy = new Proxy(allFileArray, proxyHandler)

const dispatchAllFiles = (allfiles) => {
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
    try {
        await RNFS.readDir(path).then(result => {
            result.map(element => {
                if (element?.name?.endsWith(".mp3")) {
                    proxy.push({
                        title: element.name,
                        url: element.path
                    })
                } else if (element?.isDirectory()) {
                    getFiles(element.path);
                }
            })
        });
    } catch (error) {
        console.error(error)
    }
}

export const setCurrentTrack = (trackDetails) => {
    return ({ type: SET_CURRENT_TRACK, payload: trackDetails });
}
export const setSelectedFiles = (selected) => {
    return ({ type: SET_SELECTED_FILES, payload: selected });
}