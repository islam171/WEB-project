import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Список эндпоинтов, на которые ТОЧНО не надо слать токен (логин, регистрация)
  const authUrls = ['/api/login', 'api/movies', 'api/category', 'api/actors'];
  const isAuthRequest = authUrls.some(url => req.url.includes(url));

  if (token && !isAuthRequest) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }
  return next(req);
};
