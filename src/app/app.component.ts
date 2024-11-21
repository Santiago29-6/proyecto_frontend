import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EstadosService } from './services/estados/estados.service';
import { PaisesService } from './services/paises/paises.service';
import { PersonaService } from './services/persona/persona.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  personaForm!: FormGroup;
  paises : any;
  estados : any;
  personas : any;

  constructor(
    public fb : FormBuilder,
    public estadosService: EstadosService,
    public paisesService : PaisesService,
    public personaService : PersonaService
  ){

  }

  ngOnInit(): void{
    this.personaForm = this.fb.group({
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
      next: (resp) =>{
        this.personas = resp;
      },
      error: (error) => console.error('Error al cargar las personas: ', error),
    });

    this.personaForm.get('pais')?.valueChanges.subscribe(value =>{
      this.estadosService.getAllEstadosByPais(value.id).subscribe(resp =>{
        this.estados = resp
      },
      error => { console.error('Error al cargar los estados por id: ' + error); }
    );
    });

  }

  guardar(): void{
    this.personaService.savePersona(this.personaForm.value)
    .subscribe({
      next: (resp) => {
        this.personaForm.reset();
        this.personas.push(resp);
      },
      error: (error) => {
        console.error('Error al guardar la persona:', error);
      }
    });
  }

  
}
