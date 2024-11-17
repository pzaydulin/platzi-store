import { createReducer, on } from "@ngrx/store";
import { AuthActions } from "./auth.actions";


export const AUTH_FEATURENAME = "auth"

export interface AuthData {
    accessToken: string;
}
export interface AuthState  {
    loading: boolean;
    loaded: boolean;
    serverError: string;
    authData?: AuthData;
}

export const initialState: AuthState = {
    loading: false,
    loaded: false,
    serverError: ''
}

export const authReducer = createReducer(initialState);