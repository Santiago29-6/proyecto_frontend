import { Router } from '@angular/router';
import { AuthenticationService } from './../../../core/services/authentication/authentication.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login
  }
}
