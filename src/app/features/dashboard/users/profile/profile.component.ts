import { CommonModule } from '@angular/common';
import { AuthenticationService } from './../../../../core/services/authentication/authentication.service';
import { UsersService } from './../../../../core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  profileForm !: FormGroup;

  constructor (
    public fb: FormBuilder,
    public userService : UsersService,
    public authService : AuthenticationService,
    public router : Router
  ) { }
  ngOnInit(): void {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.profileForm = this.fb.group({
      id : [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role : ['', Validators.required]
    });

    this.userService.getCurrentUser()
      .subscribe({
        next: (resp) => {
          console.log(resp);

          this.profileForm.patchValue(resp);
        },
        error: (error) => {
          console.error('No se pudo cargar el usuario por: ', error);
        }
      });
  }
  userSave(): void{
    if(this.profileForm.valid){
      this.authService.singUp(this.profileForm.value)
        .subscribe({
          next: (resp) => {
            alert('Perfil actualizado...');
            console.log(resp);
          },
          error: (error) =>{
            console.error("No se pudo actualizar el usuario...");
          }
        })
    }
  }
  changeRoleUser() : void {
    const currentRole = this.profileForm.get('role')?.value;
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    this.userService.changeRole(newRole)
      .subscribe({
        next: (resp) => {
          if(resp){
            this.profileForm.patchValue({
              role : newRole
            })
          }
        },
        error: (error) => {
          console.error("No se pudo cambiar el Rol del usuario");

        }
      })
  }
}
