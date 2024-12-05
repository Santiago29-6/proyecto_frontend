import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadosService } from '../../../core/services/estados/estados.service';
import { PaisesService } from '../../../core/services/paises/paises.service';
import { PersonaService } from '../../../core/services/persona/persona.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Pais } from '../../../shared/models/pais.model';
import { Estado } from '../../../shared/models/estado.model';
import { Persona } from '../../../shared/models/persona.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule
  ],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  providers: [
    BsModalService
  ]
})
export class PersonaComponent implements OnInit {
  @ViewChild('edit') template!: TemplateRef<any>;
  modalRef!: BsModalRef;

  personaForm!: FormGroup;
  paises !: Pais[];
  estados !: Estado[];
  personas !: Persona[];
  modalTitle: string = 'Crear nuevo cliente';
  isEditing: boolean = false;

  constructor(
    public fb: FormBuilder,
    public estadosService: EstadosService,
    public paisesService: PaisesService,
    public personaService: PersonaService,
    public router: Router,
    public modalService: BsModalService,
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();
    this.loadInitialData();

    this.personaForm.get('pais')?.valueChanges.subscribe(value => {
      if (value) {
        this.loadStatesByCountry(value.id);
      } else {
        this.estados = [];
      }
    });
  }

  private initForm(): void {
    this.personaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      pais: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  private loadInitialData(): void {
    forkJoin({
      paises: this.paisesService.getAllPaises(),
      personas: this.personaService.getAllPersona()
    }).subscribe({
      next: ({ paises, personas }) => {
        this.paises = paises;
        this.personas = personas;
      },
      error: (error) => console.error('Error al cargar datos iniciales:', error)
    });
  }

  private loadStatesByCountry(paisId: number): void {
    this.estadosService.getAllEstadosByPais(paisId).subscribe({
      next: (resp) => (this.estados = resp),
      error: (error) => console.error('Error al cargar estados:', error)
    });
  }

  abrirModal(accion: 'crear' | 'editar', persona?: Persona): void {
    this.isEditing = accion === 'editar';
    this.modalTitle = this.isEditing ? 'Editar Cliente' : 'Crear nuevo cliente';

    if (this.isEditing && persona) {
      this.personaForm.patchValue(persona);
      this.loadStatesByCountry(persona.pais.id);
    } else {
      this.personaForm.reset();
    }

    this.modalRef = this.modalService.show(this.template);
  }

  guardar(): void {
    this.personaService.savePersona(this.personaForm.value).subscribe({
      next: (resp) => {
        this.personas.push(resp);
        this.modalRef?.hide();
      },
      error: (error) => console.error('Error al guardar la persona:', error)
    });
  }

  editar(persona: Persona): void {
    this.abrirModal('editar', persona);
  }

  editPerson(): void {
    this.personaService.savePersona(this.personaForm.value)
      .subscribe({
        next: (resp) => {
          this.personaForm.reset();
          this.personas = this.personas.filter((persona: { id: number; }) => resp.id !== persona.id);
          this.personas.push(resp);

          this.modalRef?.hide();
        },
        error: (error) => {
          console.error('Error al guardar la persona:', error);
        }
      });
  }

  eliminar(persona: Persona): void {
    this.personaService.deletePersona(persona.id).subscribe({
      next: (resp) => {
        if (resp === true) {
          this.personas = this.personas.filter(p => p.id !== persona.id);
        }
      },
      error: (error) => console.error('Error al eliminar persona:', error)
    });
  }
}
