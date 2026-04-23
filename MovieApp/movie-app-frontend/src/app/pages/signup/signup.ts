import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {
  credentials = {
    username: '',
    email: '',
    password: '',
  };

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.errorMessage = '';

    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/sign-in'], {
          queryParams: { registered: '1' },
        });
      },
      error: (err) => {
        console.error('Signup error:', err);
        this.errorMessage = 'Registration failed. Check your data or username uniqueness.';
      },
    });
  }
}
