import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly API_SERVER = "http://localhost:8080/user";

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public changeRole(role: any) : Observable<any>{
    return this.httpClient.put(this.API_SERVER + "/change/" ,  role );
  }

  public getCurrentUser() : Observable<User> {
    const headers = this.createAuthHeaders();
    const token = localStorage.getItem('authToken');
    console.log(token);

    return this.httpClient.get<User>(this.API_SERVER,{headers});
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Añade el token como encabezado Authorization
    });
  }
}
