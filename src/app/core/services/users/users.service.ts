import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  headers = this.createAuthHeaders();
  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public saveUser(user : User) : Observable<User>{
    return this.httpClient.post<User>(environment.urlHost + "user", user, {headers: this.headers});
  }

  public changeRole(role: any) : Observable<any>{
    return this.httpClient.put(environment.urlHost + "user/change/" +  role , {}, { headers: this.headers });
  }

  public getCurrentUser() : Observable<User> {
    return this.httpClient.get<User>(environment.urlHost + "user", { headers: this.headers });
  }

  public getAllUsers() : Observable<User[]> {
    return this.httpClient.get<User[]>(environment.urlHost + "user/all", {headers: this.headers});
  }

  public deleteUser(id: number) : Observable<boolean> {
    return this.httpClient.delete<boolean>(environment.urlHost + "user/delete/" + id, {headers: this.headers});
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
