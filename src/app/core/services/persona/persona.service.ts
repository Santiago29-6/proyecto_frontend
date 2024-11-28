import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private API_SERVER = "http://localhost:8080/personas/"

  constructor(
    private httpClient : HttpClient
  ) { }

  public getAllPersona(): Observable<any>{
    return this.httpClient.get(this.API_SERVER);
  }

  public savePersona (persona:any) : Observable<any>{
    const headers = this.createAuthHeaders();    
    return this.httpClient.post(this.API_SERVER,persona, {headers});
  }

  public deletePersona(id:any) : Observable<any>{
    const headers = this.createAuthHeaders();
    return this.httpClient.delete(this.API_SERVER + "delete/" + id ,{headers})
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Añade el token como encabezado Authorization
    });
  }
}
