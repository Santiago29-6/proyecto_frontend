import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../../../shared/models/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private readonly API_SERVER = "http://localhost:8080/personas/"

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public getAllPersona(): Observable<Persona[]>{
    return this.httpClient.get<Persona[]>(this.API_SERVER);
  }

  public savePersona (persona:Persona) : Observable<Persona>{
    const headers = this.createAuthHeaders();
    return this.httpClient.post<Persona>(this.API_SERVER,persona, {headers});
  }

  public deletePersona(id: number) : Observable<boolean>{
    const headers = this.createAuthHeaders();
    return this.httpClient.delete<boolean>(this.API_SERVER + "delete/" + id ,{headers})
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Obtén el token del almacenamiento local
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Añade el token como encabezado Authorization
    });
  }
}
