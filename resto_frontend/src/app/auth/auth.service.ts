import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap, delay, shareReplay, map } from "rxjs/operators";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import * as moment from "moment";
import { Http } from "@angular/http";
import {server}  from "../configs/api.js";
@Injectable({
  providedIn: "root"
})
export class AuthService {
  redirectUrl: string;
  constructor(private http: HttpClient) {
  }

  login(admin): Observable<any> {
    return this.http.post<any>(`${server}/admin/login`, admin);
  }
  register(data): Observable<any> {
    return this.http.post<any>(`${server}/admin/register`, data);
  }
  updateUser(data): Observable<any> {
    return this.http
      .put<any>(`${server}/admin/verifyUser`, data)
      .pipe(shareReplay());
  }
  private setSession(authResult) {}
  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return this.http.post<any>(`${server}/admin/checkLogin`, {
      token: localStorage.getItem("token"),
      user_id: localStorage.getItem("resto-user_id")
    });
  }

  // isLoggedOut() {
  //   return !this.isLoggedIn();
  // }

  // getExpiration() {
  //   const expiration = localStorage.getItem("expires_at");
  //   const expiresAt = JSON.parse(expiration);
  //   return moment(expiresAt);
  // }
  public getToken() {
    return localStorage.getItem("id_token");
  }
}
