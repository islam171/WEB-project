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
        this.authService
          .login({
            username: this.credentials.username,
            password: this.credentials.password,
          })
          .subscribe({
            next: () => this.router.navigate(['/']),
            error: () => {
              this.router.navigate(['/sign-in']);
            },
          });
      },
      error: (err) => {
        this.errorMessage = 'Ошибка регистрации. Возможно, пользователь уже существует.';
      },
    });
  }
}
