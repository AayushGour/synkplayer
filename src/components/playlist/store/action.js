import { ADD_TO_PLAYLIST } from "./action-types"

export const addToPlaylist = (track) => {
    return ({ type: ADD_TO_PLAYLIST, payload: track });
}