import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Brand } from '../../../shared/models/brand.model';
import { BrandService } from '../../../core/services/brand/brand.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule
  ],
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
  providers: [
    BsModalService
  ]
})
export class BrandComponent implements OnInit{

  @ViewChild('edit_brand') template !: TemplateRef<any>;
  modalRef !: BsModalRef;

  brandForm !: FormGroup;
  brand !: Brand[];
  modalTitle: string = 'Crear Nueva Marca';
  isEditing: boolean = false;

  constructor (
    public fb: FormBuilder,
    public brandService: BrandService,
    public router: Router,
    public modalService: BsModalService,
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {

    if (!this.authService.isAuthenticated()){
      this.router.navigate(['/login']);
      return;
    }
    
    this.initForm();
    this.loadData();
      
  }

  private initForm() : void {
    this.brandForm = this.fb.group({
      id : [''],
      name : ['', Validators.required]
    });
  }

  private loadData() : void {
    forkJoin({
      brand: this.brandService.getAllBrand()
    }).subscribe({
      next: ({brand}) => {
        this.brand = brand;
      },
      error: (error) =>{
        console.error('Error al cargar marcas: ', error);
      }
    });
  }

  openModal(action: 'create' | 'edit', brand ?: Brand): void {
    this.isEditing = action === 'edit';
    this.modalTitle = this.isEditing ? 'Editar Marca' : 'Crear Nueva Marca';

    if (this.isEditing && brand) {
      this.brandForm.patchValue(brand);
    } else{
      this.brandForm.reset();
    }
    this.modalRef = this.modalService.show(this.template);
  }

  saveBrand() : void {
    this.brandService.saveBrand(this.brandForm.value)
      .subscribe({
        next: (resp) => {
          this.brand.push(resp);
          this.modalRef?.hide();
        },
        error: (error) => {
          console.error('No se puedo almacenar la marca: ', error);
          
        }
      });
  }

  edit(brand : Brand) : void {
    this.openModal('edit', brand);
  }

  editBrand() : void {
    this.brandService.saveBrand(this.brandForm.value)
      .subscribe({
        next: (resp) => {
          this.brandForm.reset();
          this.brand = this.brand.filter((brand : {id : number; }) => resp.id !== brand.id);
          this.brand.push(resp);

          this.modalRef?.hide();
        },
        error: (error) => {
          console.error('No se puedo editar la marca: ', error);          
        }
      });
  }

  deleteBrand(brand : Brand): void {
    this.brandService.deleteBrand(brand.id)
      .subscribe({
        next: (resp) => {
          if (resp === true) {
            this.brand = this.brand.filter(b => b.id !== brand.id);
          }
        },
        error : (error) => {
          console.error('No se pudo eliminar la marca: ', error);
        }
      });
  }

}
