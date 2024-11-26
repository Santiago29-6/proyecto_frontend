import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { AuthRequest } from '../../../shared/models/authRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:8080/authenticated';

  constructor(private httpClient : HttpClient) { }

  public signIn(authRequest : AuthRequest) : Observable<AuthRequest> {
    return this.httpClient.post<AuthRequest>(`${this.apiUrl}/sign-in`, authRequest);
  }

  public singUp(user : User) : Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/sign-up`, user);
  }
}
