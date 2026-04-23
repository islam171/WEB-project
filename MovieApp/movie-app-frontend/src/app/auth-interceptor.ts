import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const publicUrls = ['/api/login/', '/api/register/', '/api/login/refresh/'];
  const isPublicRequest = publicUrls.some((url) => req.url.includes(url));

  if (token && !isPublicRequest) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
