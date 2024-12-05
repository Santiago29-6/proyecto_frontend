import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { UsersService } from '../../../../core/services/users/users.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { User } from '../../../../shared/models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [
    BsModalService
  ]
})
export class CreateComponent implements OnInit{

  @ViewChild('edit') template!: TemplateRef<any>;
  modalRef !: BsModalRef;

  userForm !: FormGroup;
  users !: User[];
  modalTitle: string = 'Crear nuevo usuario';
  isEditing : boolean = false;

  constructor (
    public fb : FormBuilder,
    public userService: UsersService,
    public router: Router,
    public modalService: BsModalService,
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if(!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
    }
    this.initForm();
    this.loadInitialData();
  }

  private initForm() : void {
    this.userForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.min(6)]],
      role: ['', Validators.required]
    });
  }

  private loadInitialData(): void {
    forkJoin({
      users : this.userService.getAllUsers()
    }).subscribe({
      next: ({users}) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error al cargar datos iniciales: ', error);
      }
    })
  }

  userSave(): void {
    if(this.userForm.valid) {
      this.userService.saveUser(this.userForm.value)
        .subscribe({
          next: (resp) => {
            this.users.push(resp);
            this.modalRef?.hide();
          },
          error: (error) => {
            console.error("No se pudo guardar el usuario", error);
          }
        })
    }
  }

  editar(user : User): void {
    this.abrirModal('editar', user)
  }

  abrirModal(accion: 'crear' | 'editar', user?: User): void {
    this.isEditing = accion === 'editar';
    this.modalTitle = this.isEditing ? 'Editar Usuario' : 'Crear Usuario';

    if (this.isEditing && user) {
      this.userForm.patchValue(user);
    } else{
      this.userForm.reset();
    }

    this.openModal();
  }

  editUser(): void {
    this.userService.saveUser(this.userForm.value)
      .subscribe({
        next: (resp) => {
          this.userForm.reset();
          this.users = this.users.filter((user: { id: number; }) => resp.id !== user.id);
          this.users.push(resp);

          this.modalRef?.hide();
        },
        error : (error) => {
          console.error('Error al guardar el usuario: ', error);

        }
      });
  }
  eliminar (user : User): void {
    this.userService.deleteUser(user.id)
      .subscribe({
        next: (resp) => {
          if (resp === true){
            this.users = this.users.filter(p => p.id !== user.id);
          }
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      })
  }

  openModal(): void {
    this.modalRef = this.modalService.show(this.template);
  }
}
