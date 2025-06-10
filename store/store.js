import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import jobSlice from "../features/job/jobSlice";
import toggleSlice from "../features/toggle/toggleSlice";
import filterSlice from "../features/filter/filterSlice";
import employerSlice from "../features/employer/employerSlice";
import employerFilterSlice from "../features/filter/employerFilterSlice";
import candidateSlice from "../features/candidate/candidateSlice";
import candidateFilterSlice from "../features/filter/candidateFilterSlice";
import shopSlice from "../features/shop/shopSlice";
import authReducer from "../features/auth/authSlice";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { combineReducers } from "redux";

const persistConfig = {
    key: "root",
    storage,
};


const rootReducer = combineReducers(
    {
        auth: authReducer,
        job: jobSlice,
        toggle: toggleSlice,
        filter: filterSlice,
        employer: employerSlice,
        employerFilter: employerFilterSlice,
        candidate: candidateSlice,
        candidateFilter: candidateFilterSlice,
        shop: shopSlice,
    }
);


const persistedReducer = persistReducer(persistConfig, rootReducer);



export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // Required for redux-persist
        }),
});


export const persistor = persistStore(store);
