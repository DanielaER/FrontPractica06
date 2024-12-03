import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  selectedUser: any | null = null;
  errorMessage: string | null = null;
  deleteErrorMessage: string | null = null;
  userIdToDelete: number | null = null;
  showModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar todos los usuarios
  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response) => {
        this.users = response.data;
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
        this.errorMessage = 'Error al cargar los usuarios';
      }
    );
  }

  // Registrar o actualizar usuario
  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.selectedUser) {
        // Actualizar usuario
        this.userService.updateUser(this.selectedUser.key, userData).subscribe(
          (response) => {
            this.loadUsers();
            this.userForm.reset();
            this.selectedUser = null;
          },
          (error) => {
            console.error('Error al actualizar usuario:', error);
            this.errorMessage = 'Error al actualizar usuario';
          }
        );
      } else {
        // Registrar usuario
        this.userService.registerUser(userData).subscribe(
          (response) => {
            this.loadUsers();
            this.userForm.reset();
          },
          (error) => {
            console.error('Error al registrar usuario:', error);
            this.errorMessage = 'Error al registrar usuario';
          }
        );
      }
    }
  }

  // Editar usuario
  editUser(user: any): void {
    this.selectedUser = user;
    this.userForm.patchValue(user);
  }

  // Confirmar eliminación
  confirmDelete(id: number): void {
    this.userIdToDelete = id;
    this.showModal = true;
    this.deleteErrorMessage = null; // Reiniciar mensaje de error
  }

  // Cerrar modal
  closeModal(): void {
    this.showModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  // Eliminar usuario
  deleteUser(): void {
    if (this.userIdToDelete !== null) {
      this.userService.deleteUser(this.userIdToDelete).subscribe(
        (response) => {
          this.loadUsers();
          this.closeModal();
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
          this.deleteErrorMessage = 'No se puede eliminar el usuario.';
          this.closeModal();
          this.showErrorModal = true;
        }
      );
    }
  }
}
