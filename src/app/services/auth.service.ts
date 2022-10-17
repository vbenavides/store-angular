import { TokenService } from './token.service';
import { switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiURL = 'https://young-sands-07814.herokuapp.com/api/auth';

  private apiURL = 'https://damp-spire-59848.herokuapp.com/api/auth';
  private user = new BehaviorSubject<User | null>(null);

  public user$ = this.user.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string) {
    return this.http
      .post<Auth>(`${this.apiURL}/login`, { email, password })
      .pipe(
        tap((response) => this.tokenService.saveToken(response.access_token))
      );
  }

  profile() {
    // const headers = new HttpHeaders();
    // headers.set('Authorization', `Bearer ${token}`)
    return this.http
      .get<User>(`${this.apiURL}/profile`)
      .pipe(tap((user) => this.user.next(user)));
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password).pipe(switchMap(() => this.profile()));
  }

  logout() {
    this.tokenService.removeToken();
    this.user.next(null);
  }
}
