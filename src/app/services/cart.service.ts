import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}
  //  Submit cart orders
  submitCartOrder(data: any) {
    return this.http.post(this.apiUrl + '/cart/orders', data);
  }

  // Retrieve cart order details

  getCartOrderDetails() {
    return this.http.get(this.apiUrl + '/cart/cartOrder');
  }
  // delivery confirmation

  confirmDelivery(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(this.apiUrl + '/cart/updateDelivery', data, {
      headers,
    });
  }

  // delete order
  deleteOrder(id: any) {
    console.log(id);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(this.apiUrl + `/cart/deleteOrder/${id}`, {
      headers,
      params: id,
    });
  }

  // My order
  myorder(data: any) {
    return this.http.get(this.apiUrl + '/cart/myOrder', { params: data });
  }
}
