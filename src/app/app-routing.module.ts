import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'employee/new', component: EmployeeFormComponent, canActivate: [authGuard] },
  { path: 'employee/edit/:id', component: EmployeeFormComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
