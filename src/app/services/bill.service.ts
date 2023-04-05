import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private apiURL = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  ngOninit() {}

  billDetails() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiURL + '/bill/getDetails', { headers });
  }

  generateReport(orderDetails: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiURL + '/bill/generateBill', orderDetails, {
      headers,
    });
  }

  deleteBill(id: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiURL + `/bill/deleteBill/${id}`, {
      headers,
      params: id,
    });
  }
}
