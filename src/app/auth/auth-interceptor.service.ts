import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {map, tap, take, exhaustMap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next:HttpHandler) {
      return this.authService.user.pipe(
        take(1),
        exhaustMap(user => {
          if(!user){
            return next.handle(req);
          }
          const modifieReq = req.clone({params: new HttpParams().set('auth', user.token)});
          return next.handle(modifieReq);
        })
      );
    }
}
