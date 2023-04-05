import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getDetails() {
    return this.http.get(this.apiUrl + '/dashboard/details');
  }
}
