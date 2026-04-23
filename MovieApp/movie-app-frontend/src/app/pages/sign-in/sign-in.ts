import { Component } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css'],
})
export class SignIn {
  credentials = { username: '', password: '' };
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if (this.route.snapshot.queryParamMap.get('registered') === '1') {
      this.message = 'Registration successful. Please sign in.';
    }
  }

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        alert('РЈСЃРїРµС€РЅС‹Р№ РІС…РѕРґ!');
        this.router.navigate(['/']);
      },
      error: () => alert('РћС€РёР±РєР° РІС…РѕРґР°: РЅРµРІРµСЂРЅС‹Р№ Р»РѕРіРёРЅ РёР»Рё РїР°СЂРѕР»СЊ'),
    });
  }
}
