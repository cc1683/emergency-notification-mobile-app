import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../app/auth.service'

const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'reset', loadChildren: './reset/reset.module#ResetPageModule' },
  { path: 'tips', loadChildren: './tips/tips.module#TipsPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthService
  ]
})
export class AppRoutingModule { }
