// Main store
// Asyncronous action creators
import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from "redux";
import appReducer from "./reducer";

const rootReducer = combineReducers({
    app: appReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;