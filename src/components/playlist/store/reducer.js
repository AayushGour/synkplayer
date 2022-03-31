import { ADD_TO_PLAYLIST, SET_PLAYLIST } from "./action-types";

const initialState = {
    playlists: []
}

const playlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PLAYLIST:
            return Object.assign([], state, { playlists: action.payload });
        case ADD_TO_PLAYLIST:
            let addPlaylist = [...state.playlists, action.payload];
            return Object.assign([], state, { playlists: addPlaylist });
        default:
            return state;
    }
}
export default playlistReducer;