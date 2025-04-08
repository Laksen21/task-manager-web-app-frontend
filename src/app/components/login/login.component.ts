import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    const storedUsername = localStorage.getItem('username'); //check usename in local storage
    if (storedUsername) { // if username found
      this.loginForm = this.fb.group({ 
        username: [storedUsername, [Validators.required]],
        password: ['', [Validators.required]]
      });
    } else {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
    }
  }

  login(): void {
    this.authService.login({
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }).subscribe({
      next: () => {
        this.router.navigate(['/tasks'], { replaceUrl: true });
      },
      error: err => {
        console.error(err);
        if (err.status === 0) {
          this.alertService.showError('Unable to connect to the server. Please try again later.');
        } else if (err.status === 401) {
          this.alertService.showError('Invalid username or password.');
        } else {
          this.alertService.showError('Something went wrong. Please try again.');
        }
      }      
    });
  }

}
