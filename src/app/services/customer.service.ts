import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar/navbar.component';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080';
  httpClient: any;

  constructor(private http: HttpClient) {}
  //---SignUp----//
  signup(data: any) {
    return this.http.post(this.apiUrl + '/customer/signup', data, {
      headers: new HttpHeaders().set('content-Type', 'application/json'),
    });
  }

  //-----Login-----//
  login(data: any) {
    return this.http.post(this.apiUrl + '/customer/login', data, {
      headers: new HttpHeaders().set('content-Type', 'application/json'),
    });
  }

  //----Forgot Password-----//
  forgP(data: any) {
    return this.http.post(this.apiUrl + '/customer/forgotPassword', data, {
      headers: new HttpHeaders().set('content-Type', 'application/json'),
    });
  }

  //---Customer Details-----//
  detailsCus() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl + '/customer/customerDetails', {
      headers,
    });
  }
  //---Update Customer status-----//
  updateCus(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(this.apiUrl + '/customer/updateCustomer', data, {
      headers,
    });
  }

  //----Update Customer Profile----//
  updateProf(data: any) {
    return this.http.patch(this.apiUrl + '/customer/changeDetails', data, {
      headers: new HttpHeaders().set('content-Type', 'application/json'),
    });
  }

  //-------Update Customer Password----------//
  updatePass(data: any) {
    return this.http.post(this.apiUrl + '/customer/changePassword', data, {
      headers: new HttpHeaders().set('content-Type', 'application/json'),
    });
  }

  //----Delete customer-----//
  deleteCus(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiUrl + '/customer/deleteCustomer', {
      headers,
      body: data,
    });
  }

  checkToken() {
    return this.http.get(this.apiUrl + '/customer/checkToken');
  }
}
