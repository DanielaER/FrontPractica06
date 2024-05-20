import { Component } from '@angular/core';

import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'employee-management';
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    return localStorage.getItem('credentials') !== null;
  }
  logout(): void {
    localStorage.removeItem('credentials');
    
    this.router.navigate(['/login']);
  }
}
