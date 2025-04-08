import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor( private router: Router, private http: HttpClient) { }

    private AUTH_URL = 'http://localhost:8080/api/auth'; // auth endpoint
    
    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post(`${this.AUTH_URL}/login`, credentials).pipe(
            tap((response: any) => {
                localStorage.setItem('username', response.username);
                localStorage.setItem('token', response.token);
            })
        );
    }

    register(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post(`${this.AUTH_URL}/register`, credentials, { responseType: 'text' }).pipe(
            tap((response: string) => {
                if (response === "User registered successfully") {
                    localStorage.setItem('username', credentials.username);
                } else {
                    console.error('Registration failed:', response);
                }
            })
        );
    }

    getUserName(): string {
        return localStorage.getItem('username') || '';
      }
    
      logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
      }

    canActivate(): boolean {
        if (!this.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
