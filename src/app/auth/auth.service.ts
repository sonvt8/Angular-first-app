import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap} from 'rxjs/operators';
import { Subject, throwError } from 'rxjs'
import { User } from './user. model';

export interface AuthResponseData {
  email: string;
  idToken: string;
  refreshToken: string;
  kind: string;
  expireIn: string;
  localId: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDrdPu0n_7EoFXqIIwOfGsZFHzcPekPWqc',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError), tap(res => {
      this.handleAuthentication(res.email, res.localId, res.idToken, +res.expireIn)
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
      this.handleAuthentication(res.email, res.localId, res.idToken, +res.expireIn)
    }));
  }

  private handleAuthentication(email: string, userId: string, token: string, expireIn: number) {
    const expirationDate = new Date(new Date().getTime() + expireIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
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
