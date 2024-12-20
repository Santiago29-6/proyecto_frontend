import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Category } from '../../../shared/models/category.model';
import { CategoryService } from '../../../core/services/category/category.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication/authentication.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule
  ],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [
    BsModalService
  ]
})
export class CategoryComponent implements OnInit {

  @ViewChild('edit_category') template !: TemplateRef<any>;
  modalRef !: BsModalRef;

  categoryForm !: FormGroup;
  category !: Category[];
  modalTitle : string = 'Crear Nueva Categoría';
  isEditing : boolean = false;

  constructor (
    public fb : FormBuilder,
    public categoryService : CategoryService,
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
    this.loadData();

  }

  private initForm() : void {
    this.categoryForm = this.fb.group({
      id : [''],
      name : ['', Validators.required]
    });
  }

  private loadData() : void {
    forkJoin({
      category : this.categoryService.getAllCategory()
    }).subscribe({
      next : ({category}) => {
        this.category = category;
      },
      error : (error) => {
        console.error('Error al cargar las categorias: ', error);
      }
    });
  }

  openModal(action : 'create' | 'edit', category ?: Category) : void {
    this.isEditing = action === 'edit';
    this.modalTitle = this.isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría';

    if (this.isEditing && category) {
      this.categoryForm.patchValue(category);
    } else {
      this.categoryForm.reset();
    }

    this.modalRef = this.modalService.show(this.template);

  }

  saveCategory() : void {
    this.categoryService.saveCategory(this.categoryForm.value)
      .subscribe({
        next : (resp) => {
          this.category.push(resp);
          this.modalRef?.hide();
        },
        error : (error) => {
          console.error('No se pudo almacenar la categoria', error);
        }
      });
  }

  edit(category : Category) : void {
    this.openModal('edit', category);
  }

  editCategory() : void {
    this.categoryService.saveCategory(this.categoryForm.value)
      .subscribe({
        next : (resp) => {
          this.categoryForm.reset();
          this.category = this.category.filter((category : {id : number; }) => resp.id !== category.id);
          this.category.push(resp);

          this.modalRef?.hide();
        },
        error : (error) => {
          console.error('No se pudo editar la categoría: ', error);
        }
      })
  }

  deleteCategory(category : Category) : void {
    this.categoryService.deleteCategory(category.id)
      .subscribe({
        next : (resp) => {
          if (resp === true) {
            this.category = this.category.filter(c => c.id !== category.id);
          }
        },
        error : (error) => {
          console.error('No se pudo eliminar la categoria: ', error);
        }
      })
  }
}
