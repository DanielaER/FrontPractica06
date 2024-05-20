import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {
  employeeForm: FormGroup;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId = +params.get('id')!;
      if (this.employeeId) {
        this.employeeService.getEmployee(this.employeeId).subscribe(employee => {
          this.employeeForm.patchValue(employee);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;
      if (this.employeeId) {
        employee.key = this.employeeId;
        this.employeeService.updateEmployee(employee).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      } else {
        this.employeeService.addEmployee(employee).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      }
    }
  }
}