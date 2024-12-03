import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [
    BsModalService
  ]
})
export class SignupComponent implements OnInit {

  @ViewChild('successModal') template!: TemplateRef<any>;

  userSignUpForm !: FormGroup;
  modalRef: BsModalRef | undefined;

  constructor(
    public fb: FormBuilder,
    public authService: AuthenticationService,
    public modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userSignUpForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registry(): void {
    if (this.userSignUpForm.valid) {
      this.authService.singUp(this.userSignUpForm.value).subscribe({
        next: (resp) => {
          this.showSuccessModal();
        },
        error: (err) => {
          console.error("No se a podido crear el usuario por: " + err);
        }
      });
    }
  }

  showSuccessModal(): void {
    this.modalRef = this.modalService.show(this.template);
  }
}
