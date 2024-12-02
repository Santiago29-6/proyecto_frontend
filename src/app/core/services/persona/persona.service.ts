import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../../../shared/models/persona.model';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public getAllPersona(): Observable<Persona[]>{
    const headers = this.createAuthHeaders();
    return this.httpClient.get<Persona[]>(environment.urlHost + "personas/", {headers});
  }

  public savePersona (persona:Persona) : Observable<Persona>{
    const headers = this.createAuthHeaders();
    return this.httpClient.post<Persona>(environment.urlHost + "personas/",persona, {headers});
  }

  public deletePersona(id: number) : Observable<boolean>{
    const headers = this.createAuthHeaders();
    return this.httpClient.delete<boolean>(environment.urlHost + "personas/delete/" + id ,{headers})
  }

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Añade el token como encabezado Authorization
    });
  }
}
