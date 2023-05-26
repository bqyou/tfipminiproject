import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // JWT token exists, navigate to the home page
      return true;
    }
    // JWT token does not exist, allow access to the login page
    this.router.navigate(['/login']);

    return true;
  }
}
