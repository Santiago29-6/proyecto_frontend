import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../envirorements/enviroments';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private readonly httpClient : HttpClient,
    private readonly authService: AuthService
  ) { }

  public saveUser(user : User) : Observable<User>{
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.post<User>(environment.urlHost + "user", user, {headers: headers});
  }

  public changeRole(role: any) : Observable<any>{
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.put(environment.urlHost + "user/change/" +  role , {}, { headers: headers });
  }

  public getCurrentUser() : Observable<User> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.get<User>(environment.urlHost + "user", { headers: headers });
  }

  public getAllUsers() : Observable<User[]> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.get<User[]>(environment.urlHost + "user/all", {headers: headers});
  }

  public deleteUser(id: number) : Observable<boolean> {
    const headers = this.authService.createAuthHeaders();
    return this.httpClient.delete<boolean>(environment.urlHost + "user/delete/" + id, {headers: headers});
  }

}
