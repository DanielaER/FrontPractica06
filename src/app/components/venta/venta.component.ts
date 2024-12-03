import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentaService } from 'src/app/services/venta.service';  // Aquí debes tener el servicio de ventas
import { Venta } from 'src/app/models/venta.model';  // Aquí deberías tener el modelo de ventas
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  ventaForm: FormGroup;
  selectedVenta: Venta | null = null;
  errorMessage: string | null = null;
  deleteErrorMessage: string | null = null;
  ventaIdToDelete: number | null = null;
  showModal: boolean = false;
  showErrorModal: boolean = false;
  page: number = 1;  
  clientes: any[] = [];
  productos: any[] = [];
  

  constructor(
    private fb: FormBuilder,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private productoService: ProductoService
  ) {
    this.ventaForm = this.fb.group({
      cliente: ['', Validators.required],
      total: ['', [Validators.required, Validators.min(0)]],
      fecha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVentas();
    this.loadClientes();  
    this.loadProductos();

  }

  loadClientes(): void
  {
    this.clienteService.getAllClientes().subscribe(
      response => {
        this.clientes = response.data;
      },
      error => {
        console.error('Error loading clientes', error);
      }
    );
  }

  loadProductos(): void
  {
    this.productoService.getAllProductos().subscribe(
      response => {
        this.productos = response.data;
      },
      error => {
        console.error('Error loading productos', error);
      }
    );
  }
  

  
  loadVentas(): void {
    this.ventaService.getAllVentas().subscribe(
      response => {
        this.ventas = response.data;  // Asegúrate que la respuesta tenga este formato
      },
      error => {
        console.error('Error loading ventas', error);
      }
    );
  }

  onSubmit(): void {
    if (this.ventaForm.valid) {
      const venta: Venta = this.ventaForm.value;
        // Registrar una nueva venta
        this.ventaService.saveVenta(venta).subscribe(
          response => {
            this.loadVentas();
            this.ventaForm.reset();
          },
          error => {
            console.error('Error saving venta', error);
            this.errorMessage = 'Error saving venta';
          }
        );
      
    }
  }


  sendVenta(id: number): void {
    this.ventaService.sendVenta(id).subscribe(
      response => {
        console.log('Venta sent', response);
      },
      error => {
        console.error('Error sending venta', error);
        this.errorMessage = 'Error sending venta';
      }
    );
  }


  descargarReporte(idVenta: number) {
    this.ventaService.downloadVentaReport(idVenta).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `venta_${idVenta}.pdf`; // El nombre del archivo que se descargará
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar el archivo', err);
        this.showErrorModal = true;

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
