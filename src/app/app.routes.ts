import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: 'task-form', component: TaskFormComponent }, // creating task
  { path: 'task-form/:id', component: TaskFormComponent }, // editing task
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
