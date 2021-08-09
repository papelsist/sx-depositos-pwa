import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {
  redirectLoggedInToHome,
  redirectUnverifiedToPending,
  redirectVeifiedToHome,
  redirectUnauthorized,
} from '@papx/auth';

import {
  canActivate,
  hasCustomClaim,
  emailVerified,
} from '@angular/fire/auth-guard';
import { IntroductionGuard } from './intro/intro.guard';

const autorizaDepositos = () => hasCustomClaim('xpapDepositosAutorizar');
const registrarDepositos = () => hasCustomClaim('xpapDepositosCrear');

const routes2: Routes = [
  {
    path: '',
    ...canActivate(redirectUnauthorized),
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
        // ...canActivate(redirectUnverifiedToPending),
        ...canActivate(redirectUnauthorized),
      },
      // {
      //   path: 'intro',
      //   loadChildren: () =>
      //     import('./intro/intro.module').then((m) => m.IntroPageModule),
      //   canActivate: [IntroductionGuard],
      // },
      {
        path: 'solicitudes',
        loadChildren: () =>
          import('./solicitudes/solicitudes-tab/solicitudes-tab.module').then(
            (m) => m.SolicitudesTabPageModule
          ),
        ...canActivate(registrarDepositos),
        // ...canActivate(redirectUnauthorized),
      },
      {
        path: 'autorizaciones',
        loadChildren: () =>
          import(
            './autorizaciones/autotirzaciones-tab/autotirzaciones-tab.module'
          ).then((m) => m.AutotirzacionesTabPageModule),
        ...canActivate(autorizaDepositos),
        // ...canActivate(redirectUnauthorized),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
        ...canActivate(redirectUnauthorized),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./@auth/login/login.module').then((m) => m.LoginPageModule),
    // ...canActivate(redirectLoggedInToHome),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    // ...canActivate(redirectUnverifiedToPending),
  },
  {
    path: 'solicitudes',
    loadChildren: () =>
      import('./solicitudes/solicitudes-tab/solicitudes-tab.module').then(
        (m) => m.SolicitudesTabPageModule
      ),
  },
  {
    path: 'autorizaciones',
    loadChildren: () =>
      import(
        './autorizaciones/autotirzaciones-tab/autotirzaciones-tab.module'
      ).then((m) => m.AutotirzacionesTabPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./@auth/login/login.module').then((m) => m.LoginPageModule),
    // ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'pending',
    loadChildren: () =>
      import('./@auth/pending/pending.module').then((m) => m.PendingPageModule),
    // ...canActivate(redirectUnauthorized),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes2, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
