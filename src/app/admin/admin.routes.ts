import { Routes } from "@angular/router";
import { DefaultComponent } from "./shared/layout/default/default.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProductsComponent } from "./pages/products/products.component";
import { MasterComponent } from "./shared/layout/master/master.component";
import { guestGuard } from "./core/guards/guest.guard";
import { authGuard } from "./core/guards/auth.guard";
import { provideState } from "@ngrx/store";
import { AUTH_FEATURENAME, authReducer } from "./core/store/auth.reducer";
import { DEFAULT_ROUTER_FEATURENAME, routerReducer } from "@ngrx/router-store";
import { provideEffects } from "@ngrx/effects";
import { AuthEffects } from "./core/store/auth.effects";

export const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    providers: [
      provideState({ name: AUTH_FEATURENAME, reducer: authReducer }),
      provideState({ name: DEFAULT_ROUTER_FEATURENAME, reducer: routerReducer }),
      provideEffects([AuthEffects]),
    ],
    children: [
      {
        path: '',
        canActivate: [guestGuard],
        component: LoginComponent,
      },
    ],
  },
  {
    path: '',
    component: MasterComponent,
    children: [
      {
        path: 'products',
        canActivate: [authGuard],
        component: ProductsComponent,
      },
    ],
  },
];