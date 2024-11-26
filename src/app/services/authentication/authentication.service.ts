import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private API_SERVER = "http://localhost:8080/authenticated";

  constructor(
    private httpClient : HttpClient
  ) { }

  public signIn(user : any) : Observable<any> {
    return this.httpClient.post(this.API_SERVER + "sign-in", user);
  }

  public singUp(user : any) : Observable<any> {
    return this.httpClient.post(this.API_SERVER + "sign-up", user);
  }
}
