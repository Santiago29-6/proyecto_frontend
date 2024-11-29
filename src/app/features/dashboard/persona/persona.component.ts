import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadosService } from '../../../core/services/estados/estados.service';
import { PaisesService } from '../../../core/services/paises/paises.service';
import { PersonaService } from '../../../core/services/persona/persona.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Pais } from '../../../shared/models/pais.model';
import { Estado } from '../../../shared/models/estado.model';
import { Persona } from '../../../shared/models/persona.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  personaForm !: FormGroup;
  paises !: Pais[];
  estados !: Estado[];
  personas !: Persona[];

  constructor(
    public fb: FormBuilder,
    public estadosService: EstadosService,
    public paisesService: PaisesService,
    public personaService: PersonaService,
    public router: Router
  ) {

  }

  ngOnInit(): void {

    if (!localStorage.getItem('authToken')) {
      this.router.navigate(['/login']);
    }
    this.initForm();

    forkJoin({
      paises: this.paisesService.getAllPaises(),
      personas : this.personaService.getAllPersona()
    }).subscribe({
      next: ({ paises, personas }) => {
        this.paises = paises;
        this.personas = personas;
      },
      error: (error) => console.error('Error al cargar datos iniciales:', error),
    });

    this.personaForm.get('pais')?.valueChanges.subscribe(value => {
      if (value) {
        this.cargarEstadosPorPais(value.id);
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

  private cargarEstadosPorPais(paisId: number): void {
    this.estadosService.getAllEstadosByPais(paisId).subscribe({
      next: (resp) => (this.estados = resp),
      error: (error) => console.error('Error al cargar estados:', error),
    });
  }

  guardar(): void {
    this.personaService.savePersona(this.personaForm.value)
      .subscribe({
        next: (resp) => {
          this.personaForm.reset();
          this.personas = this.personas.filter((persona: { id: number; }) => resp.id !== persona.id);
          this.personas.push(resp);
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
      error: (error) => console.error('Error al eliminar persona:', error),
    });
  }


  editar(persona: Persona) {
    this.cargarEstadosPorPais(persona.pais.id);
    this.personaForm.patchValue({
      id: persona.id,
      nombre: persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad,
      pais: persona.pais,
      estado: persona.estado,
    });
  }
}
