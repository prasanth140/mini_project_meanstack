import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Common fields
  email = '';
  password = '';
  
  // Register only fields
  name = '';
  role = 'Developer';

  error = '';
  success = '';
  loading = false;
  isRegister = false; // Mode toggle

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {}

  toggleMode(mode: boolean): void {
    this.isRegister = mode;
    this.error = '';
    this.success = '';
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.email || !this.password || (this.isRegister && !this.name)) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;

    if (this.isRegister) {
      // Handle Registration
      this.authService.register({ name: this.name, email: this.email, password: this.password, role: this.role }).subscribe({
        next: (user) => {
          this.loading = false;
          this.success = 'Registration successful! Redirecting...';
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Registration failed. Try again.';
        }
      });
    } else {
      // Handle Login
      this.authService.login(this.email, this.password).subscribe({
        next: (user) => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Invalid email or password';
        }
      });
    }
  }
}
