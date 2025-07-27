import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Admin } from './admin';
import { AdminGuard } from '../core/guards/admin.guard';
import { Dashboard } from './pages/dashboard/dashboard';

const routes: Routes = [
  {
    path: '',
    component: Admin,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: Dashboard },
      // { path: 'students', loadChildren: () => import('../students/students.module').then(m => m.StudentsModule) },
      // { path: 'teachers', loadChildren: () => import('../teachers/teachers.module').then(m => m.TeachersModule) },
      // { path: 'classes', loadChildren: () => import('../classes/classes.module').then(m => m.ClassesModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
