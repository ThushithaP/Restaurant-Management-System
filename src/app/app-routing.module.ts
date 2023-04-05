import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodyComponent } from './body/body.component';
import { CustomerComponent } from './layouts/customer/customer.component';
import { CustomerOrdersComponent } from './layouts/full/customer-orders/customer-orders.component';
import { DashboardComponent } from './layouts/full/dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { ManageCategoryComponent } from './layouts/full/manage-category/manage-category.component';
import { ManageCustomerComponent } from './layouts/full/manage-customer/manage-customer.component';
import { ManageOrderComponent } from './layouts/full/manage-order/manage-order.component';
import { ProductsComponent } from './layouts/full/products/products.component';
import { ViewBillComponent } from './layouts/full/view-bill/view-bill.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { RouteGuardService } from './services/route-guard.service';

const routes: Routes = [
  { path: '', component: NavbarComponent },
  { path: 'customer', component: CustomerComponent },

  {
    path: 'full',
    component: FullComponent,
    children: [
      {
        path: 'das',
        component: DashboardComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
      {
        path: 'manageCategory',
        component: ManageCategoryComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
      {
        path: 'manageCustomer',
        component: ManageCustomerComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
      {
        path: 'viewBill',
        component: ViewBillComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
      {
        path: 'manageOrder',
        component: ManageOrderComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
      {
        path: 'view-bill/:id',
        component: ViewBillComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
      {
        path: 'customerOrder',
        component: CustomerOrdersComponent,
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'customer'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
