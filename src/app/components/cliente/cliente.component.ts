import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  selectedCliente: Cliente | null = null;
  errorMessage: string | null = null;
  deleteErrorMessage: string | null = null;
  clienteIdToDelete: number | null = null;
  showModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(private clienteService: ClienteService, private fb: FormBuilder) {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
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

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const cliente: Cliente = this.clienteForm.value;
      if (this.selectedCliente) {
        this.clienteService.updateCliente(this.selectedCliente.idCliente!, cliente).subscribe(
          response => {
            this.loadClientes();
            this.clienteForm.reset();
            this.selectedCliente = null;
          },
          error => {
            console.error('Error updating cliente', error);
            this.errorMessage = 'Error updating cliente';
          }
        );
      } else {
        this.clienteService.saveCliente(cliente).subscribe(
          response => {
            this.loadClientes();
            this.clienteForm.reset();
          },
          error => {
            console.error('Error saving cliente', error);
            this.errorMessage = 'Error saving cliente';
          }
        );
      }
    }
  }

  editCliente(cliente: Cliente): void {
    this.selectedCliente = cliente;
    this.clienteForm.patchValue(cliente);
  }

  confirmDelete(id: number): void {
    this.clienteIdToDelete = id;
    this.showModal = true;
    this.deleteErrorMessage = null; // Reset error message
  }

  closeModal(): void {
    this.showModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  deleteCliente(): void {
    if (this.clienteIdToDelete !== null) {
      this.clienteService.deleteCliente(this.clienteIdToDelete).subscribe(
        response => {
          this.loadClientes();
          this.closeModal();
        },
        error => {
          console.error('Error deleting cliente', error);
          this.deleteErrorMessage = 'No se puede eliminar el cliente porque tiene ventas registradas.';
          this.closeModal();
          this.showErrorModal = true;
        }
      );
    }
  }
}