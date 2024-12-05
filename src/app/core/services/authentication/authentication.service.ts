import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { AuthRequest } from '../../../shared/models/authRequest.model';
import { AuthResponse } from '../../../shared/models/authResponse.model';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isLoggedIn = false;

  constructor(private readonly httpClient : HttpClient) { }

  public signIn(authRequest : AuthRequest) : Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(environment.urlHost + "authentication" + "/sign-in", authRequest);
  }

  public singUp(user : User) : Observable<User> {
    return this.httpClient.post<User>(environment.urlHost + "authentication" + "/sign-up", user);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  }

  login(token: AuthResponse): void {
    localStorage.setItem('authToken', token.token);
    this.isLoggedIn = true;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
  }

}
