import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public changeRole(role: any) : Observable<any>{
    const headers = this.createAuthHeaders();
    return this.httpClient.put(environment.urlHost + "user/change/" +  role , {}, { headers });
  }

  public getCurrentUser() : Observable<User> {
    const headers = this.createAuthHeaders();
    return this.httpClient.get<User>(environment.urlHost + "user", { headers });
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
