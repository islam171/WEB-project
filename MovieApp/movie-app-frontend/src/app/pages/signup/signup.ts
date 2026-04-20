import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {
  credentials = { username: '', email : '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        alert('Успешный вход!');
        this.router.navigate(['/']); // Возвращаем на главную
      },
      error: (err) => alert('Ошибка входа: неверный логин или пароль'),
    });
  }
}
