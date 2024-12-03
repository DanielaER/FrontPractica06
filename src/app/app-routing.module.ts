import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { ProductoComponent } from './components/producto/producto.component';
import { AuthGuard } from './auth.guard';
import { UserComponent } from './components/user/user.component';
import { VentaComponent } from './components/venta/venta.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: 'ventas', component: VentaComponent, canActivate: [AuthGuard]},
  { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard]},
  { 
    path: 'productos', 
    component: ProductoComponent, 
    canActivate: [AuthGuard],  
    data: { expectedRoles: ['gerente', 'admin'] } 
  },
  { path: 'empleados', component: UserComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
