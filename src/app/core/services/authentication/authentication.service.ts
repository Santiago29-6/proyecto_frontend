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

  private apiUrl = 'http://localhost:8080/authentication';

  constructor(private httpClient : HttpClient) { }

  public signIn(authRequest : AuthRequest) : Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/sign-in`, authRequest);
  }

  public singUp(user : User) : Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/sign-up`, user);
  }
}
