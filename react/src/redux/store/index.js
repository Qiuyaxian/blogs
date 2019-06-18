// src/index.js

import { createStore } from 'redux';

import { combineReducers } from 'redux';

import $axios from '../../utils';
import reducer from '../reducers';

const initValue = {
    'userInfo':{}
}

//const rootRedux = combineReducers(reducer,initValue);
let store = createStore(reducer,initValue);

export default store;
