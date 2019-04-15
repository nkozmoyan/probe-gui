import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) { }

  @Output() change: EventEmitter<object> = new EventEmitter();

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{token: string}>(this.apiUrl+'/signin', {email: email, password: password})
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          this.getCurrentUser();
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  getCurrentUser():any{
    
    this.http.get(this.apiUrl + '/users/me').subscribe(
      res => {
        this.change.emit(res);
      },
      err => {

      }
    );
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}