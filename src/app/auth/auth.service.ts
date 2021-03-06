import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap} from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs'
import { User } from './user. model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  email: string;
  idToken: string;
  refreshToken: string;
  kind: string;
  expiresIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDrdPu0n_7EoFXqIIwOfGsZFHzcPekPWqc',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError), tap(res => {
      this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDrdPu0n_7EoFXqIIwOfGsZFHzcPekPWqc',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError), tap(res => {
      this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn)
    }));
  }

  autoLogin(){ 
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    }
    = JSON.parse(localStorage.getItem('userData'));

    if (!userData){
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if(loadedUser.token){
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMess = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMess);
    }
    switch(errorRes.error.error.message){
      case 'EMAIL_EXISTS':
        errorMess = 'this email exists aldready'
        break;
      case 'EMAIL_NOT_FOUND':
        errorMess = 'this email does not exist.'
        break;
      case 'INVALID_PASSWORD':
        errorMess = 'Invalid password.'
        break;
    }
    return throwError(errorMess);
  }
}
