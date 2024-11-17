import { createActionGroup, props } from "@ngrx/store";
import { ILogin, ILoginResponse } from "../models/auth.model";
import { AuthData } from "./auth.reducer";

export const AuthActions = createActionGroup({
  source: 'Auth API',
  events: {
    'Login': props<ILogin>(),
    'Login Success': props<{payload: AuthData}>(),
    'Login Failure': props<{ serverError: string }>(),
  },
});