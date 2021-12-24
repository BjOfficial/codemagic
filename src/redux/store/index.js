import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import appReducer from '../reducers';

const middleware = [thunk];
const initialState = {};


export default createStore(
    appReducer,
    initialState,
    compose(applyMiddleware(...middleware))
);