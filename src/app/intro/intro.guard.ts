import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class IntroductionGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const showIntro =
      localStorage.getItem('papx.sx-depositos.showIntro') || 'true';
    const force = route.queryParams.force ?? false;
    if (showIntro === 'true' || force) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
