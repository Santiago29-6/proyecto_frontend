import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private API_SERVER = "http://localhost:8080/user";

  constructor(
    private httpClient : HttpClient
  ) { }

  public changeRole(role: any) : Observable<any>{
    return this.httpClient.put(this.API_SERVER + "/change/" ,  role );
  }
}
