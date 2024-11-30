import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../../../shared/models/estado.model';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public getAllEstadosByPais(idPais: any): Observable<Estado[]>{
    return this.httpClient.get<Estado[]>(environment.urlHost + "estado/" +idPais);
  }
}
