import { Pais } from './../../../shared/models/pais.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private readonly API_SERVER = "http://localhost:8080/pais/"

  constructor(
    private readonly httpClient : HttpClient
  ) { }

  public getAllPaises(): Observable<Pais[]>{
    return this.httpClient.get<Pais[]>(this.API_SERVER);
  }
}
