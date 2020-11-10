import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { ResponseContentType } from "@angular/http";
import { Observable, of } from "rxjs";
import { Response, RequestOptions, Headers, Http } from "@angular/http";

import { AuthService } from "./auth/auth.service";
import { shareReplay } from "rxjs/operators";
import {server}  from "./configs/api.js";


@Injectable({
  providedIn: "root"
})
export class AdminService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllRestourants(id): Observable<any> {
    return this.http
      .post<any>(`${server}/admin/resto/getRestos`, {
        token: localStorage.getItem("token"),
        query: { admin: id }
      })
      .pipe(shareReplay());
  }
  getResto(id): Observable<any> {
    return this.http
      .post<any>(`${server}/resto/getResto`, {
        token: localStorage.getItem("token"),
        query: { admin: localStorage.getItem("resto-user_id"), resto_id: id }
      })
      .pipe(shareReplay());
  }
  createCategory(item) {
    return this.http
      .post(`${server}/admin/menu/createCategories`, item, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(shareReplay());
  }
  updateCategory(item) {
    return this.http
      .post(`${server}/admin/menu/updateCategories`, item)
      .pipe(shareReplay());
  }
  getMenu(query): Observable<any> {
    if (query.catId) {
      return this.http
        .post(
          `${server}/admin/menu/getMenuSimply`,
          {
            token: localStorage.getItem("token"),
            query: {
              resto: query.restoId,
              catId: query.catId,
              admin: localStorage.getItem("resto-user_id")
            }
          }
          // { reportProgress: true, observe: "events" }
        )
        .pipe(shareReplay());
    }
    return this.http
      .post(
        `${server}/admin/menu/getMenuSimply`,
        {
          token: localStorage.getItem("token"),
          query: {
            resto: query.restoId,
            admin: localStorage.getItem("resto-user_id")
          }
        },
        { reportProgress: true, observe: "events" }
      )
      .pipe(shareReplay());
  }
  createMenu(restoId, currency: string): Observable<any> {
    return this.http.post(`${server}/admin/menu/createMenu`, {
      token: localStorage.getItem("token"),
      query: {
        resto_id: restoId,
        admin: localStorage.getItem("resto-user_id")
      },
      object: {
        currency_simbol: currency
      }
    });
  }
  createTable(restoId, No): Observable<any> {
    return this.http
      .post(
        `${server}/admin/table/createTable`,
        {
          token: localStorage.getItem("token"),
          query: { admin: localStorage.getItem("resto-user_id") },
          object: { resto: restoId, No: No }
        },
        { reportProgress: true, observe: "events" }
      );
  }
  deleteTable(id: string): Observable<any> {
    return this.http
      .post(
        `${server}/admin/table/deleteTable`,
        {
          token: localStorage.getItem("token"),
          query: { admin: localStorage.getItem("resto-user_id"), resto_id: id }
        }
      )
      .pipe(shareReplay());
  }
  downloadQr(qr: string): Observable<Blob> {
    return this.http.get(`${server}/menu/getPhoto/${qr}`, {
      responseType: "blob"
    });
  }
  updateResto(obj): Observable<any> {
    return this.http
      .put(`${server}/admin/resto/updateResto`, obj)
      .pipe(shareReplay());
  }
  getRestoMembers(resto_id: string): Observable<any> {
    return this.http
      .post(`${server}/admin/resto/getMembers`, {
        token: localStorage.getItem("token"),
        query: {
          resto_id: resto_id,
          admin: localStorage.getItem("resto-user_id")
        }
      })
      .pipe(shareReplay());
  }
  updateRestoMember(data: any): Observable<any> {
    return this.http
      .put(`${server}/admin/updateUser`, {
        token: localStorage.getItem("token"),
        query: {
          admin: localStorage.getItem("resto-user_id"),
          member_id: data.member_id
        },
        object: { role: data.role }
      })
      .pipe(shareReplay());
  }
  addMemberToResto(resto_id: string, obj: any): Observable<any> {
    return this.http
      .put(`${server}/admin/resto/addMember`, {
        token: localStorage.getItem("token"),
        query: {
          resto_id: resto_id,
          admin: localStorage.getItem("resto-user_id")
        },
        object: obj
      })
      .pipe(shareReplay());
  }
  deleteMemberFromResto(member_id: string): Observable<any> {
    return this.http
      .post(`${server}/admin/deleteUser`, {
        token: localStorage.getItem("token"),
        query: {
          admin: localStorage.getItem("resto-user_id"),
          member_id: member_id
        }
      })
      .pipe(shareReplay());
  }
  getUser(): Observable<any> {
    return this.http
      .post(`${server}/admin/getUser`, {
        token: localStorage.getItem("token"),
        query: { _id: localStorage.getItem("resto-user_id") }
      })
      .pipe(shareReplay());
  }
  updateUser(obj: Object): Observable<any> {
    return this.http
      .put(`${server}/admin/updateUser`, {
        token: localStorage.getItem("token"),
        query: { member_id: localStorage.getItem("resto-user_id") },
        object: obj
      })
      .pipe(shareReplay());
  }
  createResto(obj): Observable<any> {
    return this.http
      .post(`${server}/admin/resto/createResto`, obj)
      .pipe(shareReplay());
  }
  deleteCategory(obj: any): Observable<any> {
    return this.http
      .post(`${server}/admin/menu/deleteCategories`, {
        token: localStorage.getItem("token"),
        query: { resto_id: obj.resto_id, category_id: obj.category_id }
      })
      .pipe(shareReplay());
  }
  getOrders(obj: any): Observable<any> {
    return this.http.post(`${server}/orders/getOrders`, {
      token: localStorage.getItem("token"),
      query: { resto: obj.resto }
    });
  }
}

/*
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
private httpHeaders = new RequestOptions({
      headers: new Headers({'token': localStorage.getItem('id_token')})
    });



   private setHttpHeaders = {
      headers: this.createAuthorizationHeader()
   };

     private createAuthorizationHeader() {
       const headers = new HttpHeaders();
       headers.set('token', localStorage.getItem('token'));
       return headers;
     }
*/
