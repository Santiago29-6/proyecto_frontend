import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/models/product.model';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private readonly httpClient : HttpClient,
    private readonly authService : AuthService
  ) { }

  public getAllProducts() : Observable<Product[]> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.get<Product[]>(environment.urlHost + "product", {headers: headers});
  }

  public saveProduct(data: FormData) : Observable<Product> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.post<Product>(environment.urlHost + "producto/save", data, {headers: headers});
  }

  public deleteProduct(id_product: number) : Observable<boolean> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.delete<boolean>(environment.urlHost + "category/delete/" + id_product, {headers: headers});
  }

}
