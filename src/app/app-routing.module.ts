import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MenuLayoutComponent } from './layouts/menu-layout/menu-layout.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PrintLayoutComponent } from './layouts/print-layout/print-layout.component';
import { WebLayoutComponent } from './layouts/web-layout/web-layout.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  {
    path: '',
    component: WebLayoutComponent,
    children: [

    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./views/login/login.module').then(m => m.LoginPageModule)
      },
    ]
  },
  {
    path: 'app',
    component: MenuLayoutComponent,
    children: [
      {
        path: 'establishments',
        loadChildren: () => import('./views/establishments/establishments.module').then(m => m.EstablishmentsPageModule)
      },
      {
        path: 'school-years/:establishmentId',
        loadChildren: () => import('./views/school-years/school-years.module').then(m => m.SchoolYearsPageModule)
      },
      {
        path: 'class-rooms/:establishmentId/:schoolYearId',
        loadChildren: () => import('./views/class-rooms/class-rooms.module').then(m => m.ClassRoomsPageModule)
      },
      {
        path: 'students/:establishmentId/:schoolYearId/:classRoomId',
        loadChildren: () => import('./views/students/students.module').then(m => m.StudentsPageModule)
      },
      {
        path: 'printing-display',
        loadChildren: () => import('./views/printing-display/printing-display.module').then(m => m.PrintingDisplayPageModule)
      },
    ]
  },
  {
    path: 'print',
    outlet: 'print',
    component: PrintLayoutComponent,
    children: [
      {
        path: 'cards',
        loadChildren: () => import('./views/print-cards/print-cards.module').then(m => m.PrintCardsPageModule)
      },
    ]
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
