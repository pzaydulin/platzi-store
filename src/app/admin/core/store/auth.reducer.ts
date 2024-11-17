import { createReducer, on } from "@ngrx/store";
import { AuthActions } from "./auth.actions";
import { ILoginResponse } from "../models/auth.model";


export const AUTH_FEATURENAME = "auth"

// export interface AuthData { // ILoginResponse
//     accessToken: string;
// }
export interface AuthState {
  loading: boolean;
  loaded: boolean;
  serverError: string;
  authData?: ILoginResponse;
}

export const initialState: AuthState = {
    loading: false,
    loaded: true,
    serverError: ''
}

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    serverError: '',
  })),
  on(AuthActions.loginSuccess, (state, authData: ILoginResponse) => ({
    ...state,
    loaded: true,
    loading: false,
    serverError: '',
    authData,
  })),
  on(AuthActions.loginFailure, (state, { serverError }) => ({
    ...state,
    loaded: true,
    loading: false,
    serverError,
    authData: undefined,
  }))
);