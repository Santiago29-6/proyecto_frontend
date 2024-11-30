import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './../../../../core/services/authentication/authentication.service';
import { UsersService } from './../../../../core/services/users/users.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
    HttpClientModule,
    ModalModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [
    BsModalService
  ]
})
export class ProfileComponent implements OnInit {

  @ViewChild('template') template!: TemplateRef<any>; // Usamos ! para asegurar la referencia

  profileForm !: FormGroup;
  newRole_ !: string;
  modalRef !: BsModalRef;

  constructor (
    public fb: FormBuilder,
    public userService: UsersService,
    public authService: AuthenticationService,
    public router: Router,
    public modalService: BsModalService
  ) { }

  ngOnInit(): void {
    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }

    this.profileForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.profileForm.get('role')?.disable();

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

  changeRoleUser(): void {
    const currentRole = this.profileForm.get('role')?.value;
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    this.userService.changeRole(newRole)
      .subscribe({
        next: (resp) => {
          if (resp) {
            this.profileForm.patchValue({
              role: newRole
            });
            this.newRole_ = newRole;
            this.openModal();
          }
        },
        error: (error) => {
          console.error("No se pudo cambiar el Rol del usuario", error);
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
            console.error("No se pudo actualizar el usuario: ", error);
          }
        })
    }
  }

  openModal(): void {
    this.modalRef = this.modalService.show(this.template);
  }
}
