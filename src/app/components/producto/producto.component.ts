import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/services/producto.service';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  selectedProducto: Producto | null = null;
  errorMessage: string | null = null;
  deleteErrorMessage: string | null = null;
  productoIdToDelete: number | null = null;
  showModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(private productoService: ProductoService, private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productoService.getAllProductos().subscribe(
      response => {
        this.productos = response.data;
      },
      error => {
        console.error('Error loading productos', error);
      }
    );
  }

  removeProducto(producto: Producto): void {
    const index = this.productos.indexOf(producto);
    if (index > -1) {
      this.productos.splice(index, 1);  
    }
  }
  onSubmit(): void {
    if (this.productoForm.valid) {
      const producto: Producto = this.productoForm.value;
      if (this.selectedProducto) {
        this.productoService.updateProducto(this.selectedProducto.idProducto!, producto).subscribe(
          response => {
            this.loadProductos();
            this.productoForm.reset();
            this.selectedProducto = null;
          },
          error => {
            console.error('Error updating producto', error);
            this.errorMessage = 'Error updating producto';
          }
        );
      } else {
        this.productoService.saveProducto(producto).subscribe(
          response => {
            this.loadProductos();
            this.productoForm.reset();
          },
          error => {
            console.error('Error saving producto', error);
            this.errorMessage = 'Error saving producto';
          }
        );
      }
    }
  }

  editProducto(producto: Producto): void {
    this.selectedProducto = producto;
    this.productoForm.patchValue(producto);
  }

  confirmDelete(id: number): void {
    this.productoIdToDelete = id;
    this.showModal = true;
    this.deleteErrorMessage = null; // Reset error message
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  deleteProducto(): void {
    if (this.productoIdToDelete !== null) {
      this.productoService.deleteProducto(this.productoIdToDelete).subscribe(
        response => {
          this.loadProductos();
          this.closeModal();
        },
        error => {
          console.error('Error deleting producto', error);
          this.deleteErrorMessage = 'No se puede eliminar el producto porque tiene ventas registradas.';
          this.closeModal();
          this.showErrorModal = true;
        }
      );
    }
  }
}