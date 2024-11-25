import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export const AUTH_FEATURENAME = 'auth';

export interface AuthData {
  accessToken: string;
  /**
   *  user ID from of sever DB
   */
  id?: number;
  iat?: number;
  /**
   *  timestamp of expiring
   */
  exp?: number;
}

export interface AuthState {
  loading: boolean;
  loaded: boolean;
  serverError: string;
  authData?: AuthData;
}

export const initialState: AuthState = {
  loading: false,
  loaded: true,
  serverError: '',
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    serverError: '',
  })),
  on(AuthActions.loginSuccess, (state, action) => ({
    ...state,
    loaded: true,
    loading: false,
    serverError: '',
    authData: action.payload,
  })),
  on(AuthActions.loginFailure, (state, { serverError }) => ({
    ...state,
    loaded: true,
    loading: false,
    serverError,
    authData: undefined,
  }))
);
