import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'establishments',
    loadChildren: () => import('./views/establishments/establishments.module').then( m => m.EstablishmentsPageModule)
  },
  {
    path: 'class-rooms/:establishmentId/:schoolYearId',
    loadChildren: () => import('./views/class-rooms/class-rooms.module').then( m => m.ClassRoomsPageModule)
  },
  {
    path: 'students/:establishmentId/:schoolYearId/:classRoomId',
    loadChildren: () => import('./views/students/students.module').then( m => m.StudentsPageModule)
  },
  {
    path: 'printing-display',
    loadChildren: () => import('./views/printing-display/printing-display.module').then( m => m.PrintingDisplayPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'school-years/:establishmentId',
    loadChildren: () => import('./views/school-years/school-years.module').then( m => m.SchoolYearsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
