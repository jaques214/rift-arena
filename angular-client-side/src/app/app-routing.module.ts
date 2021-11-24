import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

const routes: Routes = [
  { 
    path: 'nav-bar',
    component: NavBarComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

/*"angular-bootstrap-md": "^12.1.0",
    "bootstrap": "^5.1.3",
    "ngx-bootstrap": "^7.1.0",
*/

