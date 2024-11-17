import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AUTH_FEATURENAME, AuthState } from "./auth.reducer";

const selectFeature = createFeatureSelector<AuthState>(AUTH_FEATURENAME)

export const getLoading = createSelector(selectFeature, state => state.loading);
export const getLoaded = createSelector(selectFeature, state => state.loaded);
export const getServerError = createSelector(selectFeature, state => state.serverError);
export const getAuthData = createSelector(selectFeature, state => state.authData);

export const getAccessToken = createSelector(
    getAuthData, 
    (data) => data && data.accessToken
);

export const isAuthenticated = createSelector(
  getAccessToken,
  (token) => !!token
);