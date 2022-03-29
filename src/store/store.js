// Main store
// Asyncronous action creators
import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appReducer from "./reducer";
import playlistReducer from '../components/playlist/store/reducer';
import dataReducer from '../utility/store/reducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const rootReducer = combineReducers({
    app: appReducer,
    playlist: persistReducer(persistConfig, playlistReducer),
    data: persistReducer(persistConfig, dataReducer)
});

const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);

export default store;