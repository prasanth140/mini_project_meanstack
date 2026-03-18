import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ServicesComponent } from './components/services/services.component';
import { TestingComponent } from './components/testing/testing.component';
import { LogsComponent } from './components/logs/logs.component';
import { WorkflowsComponent } from './components/workflows/workflows.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
  { path: 'testing', component: TestingComponent, canActivate: [AuthGuard] },
  { path: 'logs', component: LogsComponent, canActivate: [AuthGuard] },
  { path: 'workflows', component: WorkflowsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
