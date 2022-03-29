import { ADD_TO_TRACK_RECORDS, SET_ALL_FILES } from "./action-types";

const initialState = {
    allFiles: [],
    trackRecords: []
}

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALL_FILES:
            return Object.assign([], state, { allFiles: action.payload })
        case ADD_TO_TRACK_RECORDS:
            let trackRec = [...state.trackRecords, action.payload]
            console.log(trackRec)
            return Object.assign([], state, { trackRecords: trackRec })
        default:
            return state;
    }
}
export default dataReducer;