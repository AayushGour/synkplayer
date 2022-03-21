// Main Reducer

import { DISPLAY_LOADER, DISPLAY_PLAYER, SET_ALL_FILES, SET_CURRENT_TRACK, SET_MODAL_CONTENT, SET_SELECTED_FILES, SET_WRITE_PERMISSION } from "./action-types";

const initialState = {
    writePermission: false,
    allFiles: [],
    displayLoader: false,
    displayPlayer: false,
    modalState: {},
    currentTrack: {},
    selectedFiles: []
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_WRITE_PERMISSION:
            return Object.assign({}, state, { writePermission: action.payload });
        case SET_ALL_FILES:
            return Object.assign([], state, { allFiles: action.payload })
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
        default:
            return state;
    }
}
export default appReducer;