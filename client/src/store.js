import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

// Initial state is empty object
const initialState = {};

/**
 * Middleware to set up redux thunk
 * which is needed to create some delays
 * in order to work with async operations.
 */
const middleware = [thunk];

/**
 * Create store and also set up
 * redux extention for development purposes.
 */
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
