import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../../../shared/models/brand.model';
import { environment } from '../../../../envirorements/enviroments';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  public getAllBrand() : Observable<Brand[]> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.get<Brand[]>(environment.urlHost + "brand", {headers: headers});
  }

  public saveBrand(brand : Brand) : Observable<Brand> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.post<Brand>(environment.urlHost + "brand/save", brand, {headers: headers});
  }

  public deleteBrand(id_brand :number) : Observable<boolean> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.delete<boolean>(environment.urlHost + "delete/" + id_brand, {headers: headers});
  }
}
