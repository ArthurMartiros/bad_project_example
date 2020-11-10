import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {server}  from "../configs/api.js";

import {HttpClient, HttpHeaders , HttpResponse } from '@angular/common/http';
import * as $ from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('this.checkLogin()',this.checkLogin())
    if (!this.checkLogin()) { this.router.navigate(['']); }
    return this.checkLogin();
  }
  checkLogin() {
    let succes;
    if (localStorage.getItem('token') && localStorage.getItem('resto-user_id')) {
      const obj = <any>{};
      obj.token = localStorage.getItem('token');
      obj.user_id = localStorage.getItem('resto-user_id');
      $.post({
        url: `${server}/admin/checkLogin`,
        data: obj,
        success: function(result) {
          succes = result.success;
        },
        async: false
      });
      return succes;
    } else {
      return false;
    }
  }
}
