import { StyleSheet } from 'react-native'
import { ExternalStorageDirectoryPath } from 'react-native-fs';
import * as RNFS from "react-native-fs";
import { setIntervalTimeout } from './src/utility/store/action';

export const THEME_BLUE_FOREGROUND = "#01a4e9";
export const THEME_BLUE_FOREGROUND_TRANSPARENT = "#01a4e990";
export const THEME_BLACK_BACKGROUND = "#121212";
export const THEME_TAB_BACKGROUND = "#1a1a1a";
export const THEME_WHITE = "#FFFFFF";
export const THEME_OFF_WHITE = "#F5F5F5";
export const TEXT_DISABLED = "#909090";
export const TRANSPARENT_BLACK = "rgba(0,0,0,0.7)";
export const WARNING_YELLOW = "#FFC302";
export const ERROR_RED = "#FF0000";
export const ModalTypes = {
    ERROR: "error",
    WARNING: "warning"
}
export const SELECT_ALL_MENU_ITEM = "Select All";
export const ADD_TO_PLAYLIST_MENU_ITEM = "Add to playlist";

export const getSDCardPath = async () => {
    return await RNFS.getAllExternalFilesDirs().then(resp => {
        let path = resp?.find((elem) => !elem.includes("emulated"));
        return (path?.split("/").slice(0, 3).join("/"));
    })
}
// export const customFonts = {
//     Montserrat: require("./src/assets/fonts/Montserrat-Regular.ttf")
// }
export const padding = (a, b, c, d) => ({
    paddingTop: a,
    paddingRight: b ?? a,
    paddingBottom: c ?? a,
    paddingLeft: d ?? b ?? a,
})

export const defaultStyles = StyleSheet.create({
    iconButtonStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 0,
        paddingRight: -10
    },
    iconButtonIconStyle: {
        margin: 0
    }
})

export const fileExtenstionList = [".mp3", ".mp4", ".flv", ".ogg", ".wav", ".amr", ".ac4", ".flac", ".adts", ".ac3", ".webm"]

export const FILE_STORAGE_DIRECTORY = `${ExternalStorageDirectoryPath}/synk-player`;