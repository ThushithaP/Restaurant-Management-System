import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar/navbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BodyComponent } from './body/body.component';
import { ToastrModule } from 'ngx-toastr';
import { FullComponent } from './layouts/full/full.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { DashboardComponent } from './layouts/full/dashboard/dashboard.component';
import { ManageCategoryComponent } from './layouts/full/manage-category/manage-category.component';
import { ProductsComponent } from './layouts/full/products/products.component';
import { ManageCustomerComponent } from './layouts/full/manage-customer/manage-customer.component';
import { ViewBillComponent } from './layouts/full/view-bill/view-bill.component';
import { ManageOrderComponent } from './layouts/full/manage-order/manage-order.component';
import { TokenInterceptorInterceptor } from './services/token-interceptor.interceptor';
import { CustomerComponent } from './layouts/customer/customer.component';
import { CustomerOrdersComponent } from './layouts/full/customer-orders/customer-orders.component';
import { FooterComponent } from './layouts/full/footer/footer.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,

    BodyComponent,
    FullComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ManageCategoryComponent,
    ProductsComponent,
    ManageCustomerComponent,
    ViewBillComponent,
    ManageOrderComponent,
    CustomerComponent,
    CustomerOrdersComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
    }),
    FormsModule,
    SlickCarouselModule,
  ],
  providers: [
    HttpClientModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
