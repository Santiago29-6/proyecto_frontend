import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../../../shared/models/estado.model';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  private readonly API_SERVER = "http://localhost:8080/estado/";

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public getAllEstadosByPais(idPais: any): Observable<Estado[]>{
    return this.httpClient.get<Estado[]>(this.API_SERVER+idPais);
  }
}
