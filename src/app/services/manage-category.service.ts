import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManageCategoryService {
  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  categoryDetails() {
    return this.http.get(this.apiUrl + '/category/details');
  }
  addCategory(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl + '/category/add', data, { headers });
  }
  updateCategory(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(this.apiUrl + '/category/update', data, { headers });
  }

  deleteCategory(data: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.apiUrl + '/category/delete', {
      headers,
      body: data,
    });
  }
}
