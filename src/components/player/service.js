// import TrackPlayer from "react-native-track-player";
import MediaMeta from "react-native-media-meta";
import TrackPlayer from "react-native-track-player";
import { ModalTypes } from "../../../Constants";
import { setCurrentTrack, setModalContent } from "../../store/actions";
import store from "../../store/store";
import { displayError } from "../services/ErrorHandler";


const getMediaMetaData = (path) => {
    return MediaMeta.get(path).then((data) => data).catch((error) => store.dispatch(setModalContent({ visible: true, content: error, type: ModalTypes.ERROR })));
}

export const clearTracks = async () => {
    // return await TrackPlayer.reset();
}

export const addTracks = async (tracks, clear = true) => {
    console.log("addTracks", tracks, clear)
    try {
        if (clear) {
            await clearTracks();
            // await TrackPlayer.add(tracks);
            // TrackPlayer.play();
        } else {
            // await TrackPlayer.add(tracks);
            // await TrackPlayer.getQueue().then(queue => {
            //     console.log(queue)
            // })
        }
    } catch (error) {
        console.error(error)
    }
    // TrackPlayer.add([
    //     // {
    //     //     url: "/storage/emulated/0/Download/Twenty one pilots - car radio.mp3",
    //     //     title: 'Car Radio Download',
    //     //     artist: 'Twenty One Pilots',

    //     // },
    //     {
    //         url: "/storage/emulated/0/Android/data/twenty one pilots - Car Radio %5BOFFICIAL VIDEO%5D.mp3",
    //         title: 'Car Radio Android',
    //         artist: 'Twenty One Pilots',

    //     },
    // ])
    // TrackPlayer.play();

}

export const formatTime = (secs) => {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [hours, minutes, seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v, i) => v !== "00" || i > 0)
        .join(":")
}
export const handlePlayerSwipe = (value) => {
    if (value > 100) {
        playPrevious();
    } else if (value < -100) {
        playNext();
    }
}

export const playNext = async () => {
    let currentTrackNumber = await TrackPlayer.getCurrentTrack();
    let queue = await TrackPlayer.getQueue();
    let nextTrackNumber = currentTrackNumber >= 0 && (currentTrackNumber + 1) < queue?.length ? currentTrackNumber + 1 : 0;
    let nextTrack = queue[nextTrackNumber];
    // store.dispatch(setCurrentTrack(nextTrack));
    await TrackPlayer.skip(nextTrackNumber);
}

export const playPrevious = async () => {
    let currentTrackNumber = await TrackPlayer.getCurrentTrack();
    let queue = await TrackPlayer.getQueue();
    let previousTrackNumber = (currentTrackNumber - 1) >= 0 ? currentTrackNumber - 1 : (queue?.length - 1);
    let previousTrack = queue[previousTrackNumber];
    // store.dispatch(setCurrentTrack(previousTrack));
    await TrackPlayer.skip(previousTrackNumber);
}

export const playTrackWithPath = async (track) => {
    // let allFiles = store.getState().data.allFiles;
    // let currentTrackIndex = allFiles?.findIndex(elem => elem.url === track.url);
    await TrackPlayer.reset().catch((error) => displayError(error));
    store.dispatch(setCurrentTrack(track));
    // await TrackPlayer.skip(currentTrackIndex).catch((error) => displayError(error));
    await TrackPlayer.add(track).catch((error) => displayError(error));
    await TrackPlayer.play().catch((error) => displayError(error));
}

export const playTrackWithIndex = async (index) => {
    let allFiles = store.getState().data.allFiles;
    let queue = await TrackPlayer.getQueue();
    if (queue?.length != allFiles?.length) {
        console.log(allFiles, index)
        await TrackPlayer.reset().catch((error) => displayError(error));
        let currentTrack = allFiles[index];
        store.dispatch(setCurrentTrack(currentTrack));
        await TrackPlayer.add(allFiles).catch((error) => displayError(error));
        await TrackPlayer.skip(index).catch((error) => displayError(error));
        await TrackPlayer.play().catch((error) => displayError(error));
    } else {
        let currentTrack = allFiles[index];
        store.dispatch(setCurrentTrack(currentTrack));
        await TrackPlayer.skip(index).catch((error) => displayError(error));
        await TrackPlayer.play().catch((error) => displayError(error));

    }
}

export const playTrack = async (track) => {
    await TrackPlayer.reset().catch((error) => displayError(error));
    store.dispatch(setCurrentTrack(track));
    await TrackPlayer.add(track).catch((error) => displayError(error));
    await TrackPlayer.play().catch((error) => displayError(error));
}