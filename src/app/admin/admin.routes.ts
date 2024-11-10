import { Routes } from "@angular/router";
import { DefaultComponent } from "./shared/layout/default/default.component";
import { LoginComponent } from "./pages/login/login.component";
import { ProductsComponent } from "./pages/products/products.component";
import { MasterComponent } from "./shared/layout/master/master.component";
import { guestGuard } from "./core/guards/guest.guard";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
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