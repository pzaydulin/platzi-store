import { createActionGroup, props } from "@ngrx/store";
import { ILogin, ILoginResponse } from "../models/auth.model";

export const AuthActions = createActionGroup({
  source: 'Auth API',
  events: {
    'Login': props<ILogin>(),
    'Login Success': props<ILoginResponse>(),
    'Login Failure': props<{ serverError: string }>(),
  },
});