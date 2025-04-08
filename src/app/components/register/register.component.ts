import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from './../../validators/password.match.validator';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },
    { validator: passwordMatchValidator }
  );
  }

  register(): void {
    if (this.registerForm.invalid) { 
      return; 
    } 
    this.authService.register({
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value
    }).subscribe({
      next: () => {
        this.registerForm.reset(); // Reset the form
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: err => {
        console.error(err);

        if (err.status === 0) {
          this.alertService.showError('Unable to connect to the server. Please try again later.');
        } else {
          this.alertService.showError('Registration failed. Please try again.');
        }
      }
    });
    
  }
}
