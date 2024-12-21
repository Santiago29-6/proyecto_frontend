import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Product } from '../../../shared/models/product.model';
import { Category } from '../../../shared/models/category.model';
import { Brand } from '../../../shared/models/brand.model';
import { ProductService } from '../../../core/services/product/product.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { BrandService } from '../../../core/services/brand/brand.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule
  ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [
    BsModalService
  ]
})
export class ProductComponent implements OnInit{

  @ViewChild('edit_product') template !: TemplateRef<any>;
  modalRef !: BsModalRef;

  previewImage: string | null = null;

  productForm !: FormGroup;
  product !: Product[];
  category !: Category[];
  brand !: Brand[];
  modalTitle : string = 'Crear Nuevo Producto';
  isEditing : boolean = false;

  constructor (
    public fb : FormBuilder,
    public productService : ProductService,
    public categoryService : CategoryService,
    public brandService : BrandService,
    public router : Router,
    public modalService : BsModalService,
    public authService : AuthenticationService 
  ) { }

  ngOnInit(): void {
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForm();
    this.loadInitialData();

  }

  private initForm() : void {
    this.productForm = this.fb.group({
      id : [''],
      name : ['', Validators.required],
      description : ['', Validators.required],
      price : ['', [Validators.required, Validators.min(0)]],
      quantity : ['', [Validators.required, Validators.min(0)]],
      sku : ['', Validators.required],
      estate : ['', Validators.required],
      image: [null, Validators.required],
      brand : ['', Validators.required],
      category : ['', Validators.required]
    });
  }

  private loadInitialData() : void {
    forkJoin({
      product : this.productService.getAllProducts(),
      category : this.categoryService.getAllCategory(),
      brand : this.brandService.getAllBrand()
    }).subscribe({
      next : ({product, category, brand}) => {
        this.product = product;
        this.category = category;
        this.brand = brand;
      },
      error : (error) => {
        console.error('Error al cargar los datos: ', error);
      }
    })
  }

  openModal(action : 'create' | 'edit', product ?: Product) : void {
    this.isEditing = action === 'edit';
    this.modalTitle = this.isEditing ? 'Editar Producto' : 'Crear Nuevo Producto';

    if (this.isEditing && product) {
      this.productForm.patchValue(product);
    } else {
      this.productForm.reset();
    }

    this.modalRef = this.modalService.show(this.template);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
  
    if (file) {
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.previewImage = null;
      this.productForm.patchValue({ image: null });
    }
  }  
  
  saveProduct(): void {
    const formData = new FormData();
    Object.keys(this.productForm.value).forEach((key) => {
      const value = this.productForm.get(key)?.value;
      formData.append(key, value);
    });
  
    this.productService.saveProduct(formData).subscribe({
      next: (resp) => {
        console.log('Producto guardado:', resp);
      },
      error: (err) => {
        console.error('Error al guardar el producto:', err);
      },
    });
  }
  

  editP(product : Product) : void {
    this.openModal('edit', product);
  }

  editProduct() : void {
    this.productService.saveProduct(this.productForm.value)
      .subscribe({
        next : (resp) => {
          this.productForm.reset();
          this.product = this.product.filter((product : { id : number; }) => resp.id !== product.id);
          this.product.push(resp);

          this.modalRef?.hide();
        },
        error : (error) => {
          console.error('No se pudo editar el producto: ', error);
        }
      });
  }

  deleteProduct(product : Product) : void {
    this.productService.deleteProduct(product.id)
      .subscribe({
        next : (resp) => {
          if (resp === true) {
            this.product = this.product.filter(p => p.id !== product.id);
          }
        },
        error : (error) => {
          console.error('No se pudo eliminar el producto: ', error);
        }
      });
  }

}
