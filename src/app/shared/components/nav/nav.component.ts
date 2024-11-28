import { Component } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login
  }
}
