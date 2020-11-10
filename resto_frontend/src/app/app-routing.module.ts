import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AppComponent } from "./app.component";
import { AdminComponent } from "./components/admin/admin.component";
import { RegisterComponent } from "./auth/register/register.component";
import { InRestoComponent } from "./components/in-resto/in-resto.component";
import { LoginComponent } from "./auth/login/login.component";
import { CreateMenuCategoryComponent } from "./components/create-menu-category/create-menu-category.component";
import { ShowMenuComponent } from "./components/show-menu/show-menu.component";
import { UpdateMenuCategoryComponent } from "./components/update-menu-category/update-menu-category.component";
import { EditRestoInfoComponent } from "./components/edit-resto-info/edit-resto-info.component";
import { RestoMembersComponent } from "./components/resto-members/resto-members.component";
import { AdminCredentialsComponent } from "./components/admin-credentials/admin-credentials.component";
import { ShowComponentComponent } from "./components/show-component/show-component.component";
import { CreateRestoComponent } from "./components/create-resto/create-resto.component";
import { OrderHistoryComponent } from "./components/order-history/order-history.component";
import { AuthGuard } from "./auth/auth.guard";

// **************************************************

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegisterComponent },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: "admin/credentials",
    component: AdminCredentialsComponent,
    canActivate: [AuthGuard]
  },
  { path: "admin/:id", component: InRestoComponent, canActivate: [AuthGuard] },
  {
    path: "admin/create_menu_category/:id",
    component: CreateMenuCategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/edit_menu_category/:id/:catId",
    component: UpdateMenuCategoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/edit_resto/:id",
    component: EditRestoInfoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/resto_members/:id",
    component: RestoMembersComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "admin/show_menu/:id",
    component: ShowMenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/show_category/:id/:catId",
    component: ShowComponentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "create_resto",
    component: CreateRestoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "admin/resto/order_history/:id",
    component: OrderHistoryComponent,
    canActivate: [AuthGuard]
  },

  // *******************************
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
