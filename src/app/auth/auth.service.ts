import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponseData {
  email: string;
  idToken: string;
  refreshToken: string;
  kind: string;
  expiresIn: string;
  localId: string;
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
    });
  }
}
