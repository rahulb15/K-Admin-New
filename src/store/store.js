// src/store/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import launchpadReducer from 'src/features/launchpadSlice';
// import { launchpadApi } from 'src/services/launchpad.service'
import { launchpadApi } from '../services/launchpad.service'
import launchpadReducer from '../features/launchpadSlice'

const rootReducer = combineReducers({
    launchpad: launchpadReducer,
    [launchpadApi.reducerPath]: launchpadApi.reducer,
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: [ 'launchpad'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const loggerMiddleware = (store) => (next) => (action) => {
    console.log('Dispatching', action)
    let result = next(action)
    console.log('Next State', store.getState())
    return result
  }

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(loggerMiddleware, launchpadApi.middleware),
})

export const persistor = persistStore(store)