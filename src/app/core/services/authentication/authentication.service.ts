import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { AuthRequest } from '../../../shared/models/authRequest.model';
import { AuthResponse } from '../../../shared/models/authResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isLoggedIn = false;

  private apiUrl = 'http://localhost:8080/authentication';

  constructor(private httpClient : HttpClient) { }

  public signIn(authRequest : AuthRequest) : Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/sign-in`, authRequest);
  }

  public singUp(user : User) : Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/sign-up`, user);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // Verifica si existe el token
  }

  login(token: AuthResponse): void {
    localStorage.setItem('authToken', token.token); // Guarda el token al iniciar sesión
    this.isLoggedIn = true;
  }

  logout(): void {
    localStorage.removeItem('authToken'); // Elimina el token al cerrar sesión
    this.isLoggedIn = false;
  }

}
