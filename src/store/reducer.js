// Main Reducer

import { DISPLAY_LOADER, DISPLAY_PLAYER, SET_CURRENT_TRACK, SET_MODAL_CONTENT, SET_SELECTED_FILES, SET_SELECT_FILE, SET_WRITE_PERMISSION } from "./action-types";

const initialState = {
    writePermission: false,
    displayLoader: false,
    displayPlayer: false,
    modalState: {},
    currentTrack: {},
    selectFile: false,
    selectedFiles: []
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_WRITE_PERMISSION:
            return Object.assign({}, state, { writePermission: action.payload });
        case DISPLAY_LOADER:
            return Object.assign({}, state, { displayLoader: action.payload })
        case DISPLAY_PLAYER:
            return Object.assign({}, state, { displayPlayer: action.payload })
        case SET_MODAL_CONTENT:
            return Object.assign({}, state, { modalState: action.payload })
        case SET_CURRENT_TRACK:
            return Object.assign({}, state, { currentTrack: action.payload })
        case SET_SELECTED_FILES:
            return Object.assign([], state, { selectedFiles: action.payload })
        case SET_SELECT_FILE:
            return Object.assign([], state, { selectFile: action.payload })
        default:
            return state;
    }
}
export default appReducer;