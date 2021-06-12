import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs'

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

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDrdPu0n_7EoFXqIIwOfGsZFHzcPekPWqc',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDrdPu0n_7EoFXqIIwOfGsZFHzcPekPWqc',
    {
      email: email,
      password: password,
      returnSecureToken: true
    })
    .pipe(catchError(this.handleError));
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
