import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { ILogin, ILoginResponse } from "../models/auth.model";
import { AuthData } from "./auth.reducer";

export const AuthActions = createActionGroup({
  source: 'Auth API',
  events: {
    'Login': props<ILogin>(),
    'Login Success': props<{ payload: AuthData }>(),
    'Login Failure': props<{ serverError: string }>(),
    'Init Auth Data': emptyProps(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    "Get Data From Storage": emptyProps()
  },
});