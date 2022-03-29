// Define all actions
import { DISPLAY_LOADER, DISPLAY_PLAYER, SET_ALL_FILES, SET_CURRENT_TRACK, SET_MODAL_CONTENT, SET_SELECTED_FILES } from './action-types';

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

export const setCurrentTrack = (trackDetails) => {
    return ({ type: SET_CURRENT_TRACK, payload: trackDetails });
}
export const setSelectedFiles = (selected) => {
    return ({ type: SET_SELECTED_FILES, payload: selected });
}
export const resetSelectedFiles = () => {
    return ({ type: SET_SELECTED_FILES, payload: [] });
}