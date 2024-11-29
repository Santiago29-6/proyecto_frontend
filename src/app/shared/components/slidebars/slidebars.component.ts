import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slidebars',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './slidebars.component.html',
  styleUrl: './slidebars.component.css'
})
export class SlidebarsComponent {
  constructor (
    authService : AuthenticationService,
    router : Router
  ) { }
}
