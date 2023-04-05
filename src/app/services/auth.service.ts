import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private http: HttpClient) {
    this.loggedIn.next(!!localStorage.getItem('token'));
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

  login(user: { email: string; password: string }) {
    return this.http.post('/api/login', user).subscribe((result: any) => {
      localStorage.setItem('token', result.token);
      this.loggedIn.next(true);
      this.router.navigate(['/dashboard']);
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get decodedToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return this.parseJwt(token);
    }
    return null;
  }

  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }
}
