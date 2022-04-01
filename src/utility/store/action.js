import store from "../../store/store";
import { SET_ALL_FILES, ADD_TO_TRACK_RECORDS, SET_DIRECTORY_READ_PATH } from "./action-types";
import * as RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';
import { fileExtenstionList, getSDCardPath } from "../../../Constants";
import { toggleLoader } from "../../store/actions";

export var allFileArray = [];
let timeout = null;
let count = 0;

export const setIntervalTimeout = () => {
    let mainTimeout = setInterval(async () => {
        count++;
        if (allFileArray?.length === 0 && count >= 2) {
            store.dispatch(toggleLoader(false));
            clearInterval(mainTimeout);
            count = 0;
            store.dispatch(dispatchAllFiles(allFileArray));
            await TrackPlayer.reset();
            await TrackPlayer.add(allFileArray);
        } else {
            clearInterval(mainTimeout);
        }
    }, 15000);
}


const proxyHandler = {
    get(target, property, receiver) {
        if (property === "reset") {
            target?.splice(0, target?.length);
        } else {
            !!timeout && clearTimeout(timeout);
            // if (target?.length > 0) {
            timeout = setTimeout(async () => {
                store.dispatch(dispatchAllFiles(allFileArray.sort((a, b) => a?.title > b?.title ? 1 : (a?.title < b?.title ? -1 : 0))));
                store.dispatch(toggleLoader(false));
                await TrackPlayer.reset();
                await TrackPlayer.add(allFileArray);
                // await TrackPlayer.getQueue().then(r => console.log("after adding tracs", r))
            }, 1000);
            // }
            return target[property];
        }
    }
}

const proxy = new Proxy(allFileArray, proxyHandler);

const dispatchAllFiles = (allfiles) => {
    return {
        type: SET_ALL_FILES,
        payload: allfiles
    }
}
export const getFiles = async (path) => {
    proxy.reset
    Object.assign(allFileArray, []);
    setIntervalTimeout();
    computeDirectoryList(path);
}

export const computeDirectoryList = async (path) => {
    try {
        await RNFS.readDir(path).then(result => {
            result.map(element => {
                if (fileExtenstionList.some((extension) => { return element?.name?.endsWith(extension) })) {
                    let trackRecords = store.getState().data.trackRecords;
                    let track = {};
                    if (trackRecords?.some(elem => elem?.url === element?.path)) {
                        track = trackRecords?.find(elem => elem?.url === element?.path);
                    } else {
                        track = {
                            title: element.name,
                            url: element.path
                        }
                    }
                    proxy.push(track);
                } else if (element?.isDirectory()) {
                    computeDirectoryList(element.path);
                }
            })
        });
    } catch (error) {
        console.error(error)
    }
}


export const addTrackToTrackRecords = (track) => {
    return ({ type: ADD_TO_TRACK_RECORDS, payload: track })
}

export const toggleDirectoryReadPath = () => {
    return function (dispatch) {
        let currentPath = store.getState().data.directoryReadPath;
        if (currentPath === RNFS.ExternalStorageDirectoryPath) {
            return getSDCardPath().then(resp => {
                dispatch(setDirectoryPath(resp))
            })
        } else {
            dispatch(setDirectoryPath(RNFS.ExternalStorageDirectoryPath));
        }
    }
}

const setDirectoryPath = (path) => {
    return ({ type: SET_DIRECTORY_READ_PATH, payload: path });
}