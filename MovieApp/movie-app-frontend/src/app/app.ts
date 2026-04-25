import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Header } from './components/header/header.component';
import { Footer } from "./components/footer/footer";
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer], // 2. Добавляем его в массив imports
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private hideLoaderTimeoutId: number | null = null;

  title = 'movie-app-frontend';
  isAppLoading = true;
  isLoaderVisible = true;

  ngOnInit(): void {
    this.scheduleLoaderHide(2000);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.showLoader();
        this.scheduleLoaderHide(1000);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.hideLoaderTimeoutId !== null) {
      window.clearTimeout(this.hideLoaderTimeoutId);
    }
  }

  private showLoader(): void {
    this.isAppLoading = true;
    this.isLoaderVisible = true;
    this.cdr.detectChanges();
  }

  private scheduleLoaderHide(delayMs: number): void {
    if (this.hideLoaderTimeoutId !== null) {
      window.clearTimeout(this.hideLoaderTimeoutId);
    }

    this.hideLoaderTimeoutId = window.setTimeout(() => {
      this.isLoaderVisible = false;
      this.cdr.detectChanges();

      window.setTimeout(() => {
        this.isAppLoading = false;
        this.cdr.detectChanges();
      }, 350);
    }, delayMs);
  }
}
