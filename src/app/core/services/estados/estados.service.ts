import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  private API_SERVER = "http://localhost:8080/estado/";

  constructor(
    private httpClient : HttpClient 
  ) { }

  public getAllEstadosByPais(idPais: any){
    return this.httpClient.get(this.API_SERVER+idPais);
  }
}
