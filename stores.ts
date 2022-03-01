import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import createRootReducer from "redux/reducers";
import {rootSaga} from "redux/sagas";


const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  (state, action) => createRootReducer(state, action),
  applyMiddleware(sagaMiddleware),
);

export default store;

sagaMiddleware.run(rootSaga);