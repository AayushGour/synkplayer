import store from "../../store/store";
import { SET_ALL_FILES, ADD_TO_TRACK_RECORDS } from "./action-types";
import * as RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';
import { fileExtenstionList } from "../../../Constants";
import { toggleLoader } from "../../store/actions";

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
export const getFiles = async (path) => {
    try {
        await RNFS.readDir(path).then(result => {
            result.map(element => {
                if (fileExtenstionList.some((extension) => { return element?.name?.endsWith(extension) })) {
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

export const addTrackToTrackRecords = (track) => {
    return ({ type: ADD_TO_TRACK_RECORDS, payload: track })
}