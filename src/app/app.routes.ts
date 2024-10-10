import { Routes } from '@angular/router';
import { DefaultComponent } from './admin/shared/layout/default/default.component';
import { LoginComponent } from './admin/pages/login/login.component';
import { MasterComponent } from './admin/shared/layout/master/master.component';
import { ProductsComponent } from './admin/pages/products/products.component';

export const routes: Routes = [
    {
        path: "",
        component: DefaultComponent,
        children: [
            {
                path: "",
                component: LoginComponent
            }
        ]
    },
    {
        path: "",
        component: MasterComponent,
        children: [
            {
                path: "products",
                component: ProductsComponent
            }
        ]

    }
];
