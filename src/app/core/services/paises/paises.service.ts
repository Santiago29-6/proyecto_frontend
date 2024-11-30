import { Pais } from './../../../shared/models/pais.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public getAllPaises(): Observable<Pais[]>{
    return this.httpClient.get<Pais[]>(environment.urlHost + "pais/");
  }
}
