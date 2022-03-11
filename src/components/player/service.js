import TrackPlayer from "react-native-track-player";
import MediaMeta from "react-native-media-meta";
import store from "../../store/store";
import { setModalContent } from "../../store/actions";
import { ModalTypes } from "../../../Constants";

export const playerService = async () => {

}

const getMediaMetaData = (path) => {
    return MediaMeta.get(path).then((data) => data).catch((error) => store.dispatch(setModalContent({ visible: true, content: error, type: ModalTypes.ERROR })));
}

export const addTracks = () => {
    getMediaMetaData("/storage/emulated/0/Android/data/twenty one pilots - Car Radio %5BOFFICIAL VIDEO%5D.mp3").then(data => {
        console.log(data)
    })
    TrackPlayer.add([
        {
            url: "/storage/emulated/0/Download/Twenty one pilots - car radio.mp3",
            title: 'Car Radio Download',
            artist: 'Twenty One Pilots',

        },
        {
            url: "/storage/emulated/0/Android/data/twenty one pilots - Car Radio %5BOFFICIAL VIDEO%5D.mp3",
            title: 'Car Radio Android',
            artist: 'Twenty One Pilots',

        },
    ])
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

export const playNext = () => {
    TrackPlayer.skipToNext();
}

export const playPrevious = () => {
    TrackPlayer.skipToPrevious();
}