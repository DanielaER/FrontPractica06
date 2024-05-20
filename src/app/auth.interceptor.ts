import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const credentials = this.authService.getCredentials();
    if (credentials) {
      // Encode credentials to Base64
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Basic ${encodedCredentials}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
