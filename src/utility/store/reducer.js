import { ExternalStorageDirectoryPath } from "react-native-fs";
import { ADD_TO_TRACK_RECORDS, SET_ALL_FILES, SET_DIRECTORY_READ_PATH } from "./action-types";


const initialState = {
    allFiles: [],
    trackRecords: [],
    directoryReadPath: ExternalStorageDirectoryPath
}

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_FILES:
            return Object.assign([], state, { allFiles: action.payload })
        case ADD_TO_TRACK_RECORDS:
            let trackRec = [...state.trackRecords, action.payload]
            console.log(trackRec)
            return Object.assign([], state, { trackRecords: trackRec })
        case SET_DIRECTORY_READ_PATH:
            return Object.assign({}, state, { directoryReadPath: action.payload })

        default:
            return state;
    }
}
export default dataReducer;