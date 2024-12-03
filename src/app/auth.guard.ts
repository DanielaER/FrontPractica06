import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRoles'];
    const currentRole = this.authService.getRole();
    console.log(expectedRole);
    console.log(currentRole);
    var currentRoleBool = false;

    if (expectedRole === undefined) {
      currentRoleBool = true;
    } else{
    if (expectedRole.length === 0) {
      if (expectedRole === currentRole) {
        currentRoleBool = true;
      }
    }else{
    expectedRole.forEach((element: string) => {
      if (element === currentRole) {
        currentRoleBool = true;
      }
    });
  }
  }
    if (this.authService.isAuthenticated() && (currentRoleBool)) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}