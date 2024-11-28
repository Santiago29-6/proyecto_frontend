import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadosService } from '../../../core/services/estados/estados.service';
import { PaisesService } from '../../../core/services/paises/paises.service';
import { PersonaService } from '../../../core/services/persona/persona.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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
  styleUrl: './persona.component.css'
})
export class PersonaComponent implements OnInit{

  personaForm!: FormGroup;
  paises: any;
  estados: any;
  personas: any;

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

    this.personaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required]
    })

    this.paisesService.getAllPaises().subscribe({
      next: (resp) => {
        this.paises = resp;
      },
      error: (error) => console.error('Error al cargar países:', error),
    });

    this.personaService.getAllPersona()
      .subscribe({
        next: (resp) => {
          this.personas = resp;
        },
        error: (error) => console.error('Error al cargar las personas: ', error),
      });

    this.personaForm.get('pais')?.valueChanges.subscribe(value => {
      this.estadosService.getAllEstadosByPais(value.id)
        .subscribe({
          next: (resp) => {
            this.estados = resp
          },
          error: (error) => console.error('Error al cargar los estados por id: ' + error)
        });
    });

  }

  guardar(): void {
    this.personaService.savePersona(this.personaForm.value)
      .subscribe({
        next: (resp) => {
          this.personaForm.reset();
          this.personas = this.personas.filter((persona: { id: any; }) => resp.id !== persona.id);
          this.personas.push(resp);
        },
        error: (error) => {
          console.error('Error al guardar la persona:', error);
        }
      });
  }

  eliminar(persona: any) {
    this.personaService.deletePersona(persona.id)
      .subscribe({
        next: (resp) => {
          if (resp === true) {
            this.personas.pop(persona);
          }
        },
        error: (error) => {
          console.error('Error al eliminar persona: ', error);
        }
      });
  }

  editar(persona: any) {
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
