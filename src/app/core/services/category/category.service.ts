import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Category } from '../../../shared/models/category.model';
import { environment } from '../../../../envirorements/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private readonly httpClient : HttpClient,
    private readonly authService: AuthService
  ) { }

  public getAllCategory() : Observable<Category[]> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.get<Category[]>(environment.urlHost + "category", {headers: headers});
  }

  public saveCategory(category: Category) : Observable<Category> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.post<Category>(environment.urlHost + "category/save", category, {headers : headers})
  }

  public deleteCategory(id_category : number) : Observable<boolean> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.delete<boolean>(environment + "category/delete/" + id_category , {headers: headers})
  }
}
