import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from 'src/app/services/venta.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { Venta } from 'src/app/models/venta.model';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  ventaForm: FormGroup;
  clientes: any[] = [];
  productos: any[] = [];
  productosSeleccionados: any[] = [];
  productoSeleccionado: number | null = null; // ID del producto seleccionado
  errorMessage: string | null = null;
  deleteErrorMessage: string | null = null;
  showModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService
  ) {
    this.ventaForm = this.fb.group({
      cliente: ['', Validators.required],
      total: ['', [Validators.required, Validators.min(0)]],
      fecha: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadProductos();
    this.loadVentas();
  }

  loadClientes(): void {
    this.clienteService.getAllClientes().subscribe(
      response => {
        this.clientes = response.data;
      },
      error => {
        console.error('Error loading clientes', error);
      }
    );
  }

  loadProductos(): void {
    this.productoService.getAllProductos().subscribe(
      response => {
        this.productos = response.data;
        console.log('Productos:', this.productos);
      },
      error => {
        console.error('Error loading productos', error);
      }
    );
  }

  loadVentas(): void {
    this.ventaService.getAllVentas().subscribe(
      response => {
        this.ventas = response.data;
      },
      error => {
        console.error('Error loading ventas', error);
      }
    );
  }

  agregarProducto(): void {
    console.log('Producto seleccionado:', this.productoSeleccionado);
    if (!this.productoSeleccionado) {
      alert('Por favor seleccione un producto.');
      return;
    }
  
    const producto = this.productos.find(p => Number(p.idProducto) === Number(this.productoSeleccionado));

    console.log('Producto:', producto);
    if (!producto) return;
  
    this.productosSeleccionados.push({
      ...producto,
      cantidad: 1,
      precio: producto.precio,
      subtotal: producto.precio 
    });
    this.productoSeleccionado = null; // Resetear el dropdown
    this.actualizarTotal();
  }
  
  actualizarSubtotal(index: number): void {
    console.log("actualizarSubtotal");
    const producto = this.productosSeleccionados[index];
    if (producto.cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }
    producto.subtotal = producto.cantidad * producto.precio;
    this.actualizarTotal();
  }
  
  onSubmit(): void {
    if (this.ventaForm.valid && this.productosSeleccionados.length > 0) {
      const ventaData = {
        ...this.ventaForm.value,
        productos: this.productosSeleccionados
      };
      console.log('Venta Registrada:', ventaData);
      this.ventaService.saveVenta(ventaData).subscribe(
        response => {
          console.log('Venta guardada con éxito:', response);
          this.loadVentas();
          this.ventaForm.reset();
          this.productosSeleccionados = [];
        },
        error => {
          console.error('Error al guardar la venta:', error);
        }
      );
    } else {
      alert('Por favor complete el formulario y añada al menos un producto.');
    }
  }
  

  eliminarProducto(index: number): void {
    this.productosSeleccionados.splice(index, 1);
    this.actualizarTotal();
  }

  

  actualizarTotal(): void {
    const total = this.productosSeleccionados.reduce((sum, producto) => sum + producto.subtotal, 0);
    this.ventaForm.patchValue({ total });
  }


  sendVenta(id: number): void {
    this.ventaService.sendVenta(id).subscribe(
      response => {
        console.log('Correo enviado con éxito:', response);
      },
      error => {
        console.error('Error enviando correo:', error);
      }
    );
  }

  descargarReporte(idVenta: number): void {
    this.ventaService.downloadVentaReport(idVenta).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `venta_${idVenta}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error descargando el reporte:', err);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }
}
