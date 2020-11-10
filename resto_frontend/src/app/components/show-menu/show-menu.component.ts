import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {server} from "../../configs/api";

import { Observable } from "rxjs";
@Component({
  selector: "app-show-menu",
  templateUrl: "./show-menu.component.html",
  styleUrls: ["./show-menu.component.css"]
})
export class ShowMenuComponent implements OnInit {
  constructor(private service: AdminService, private route: ActivatedRoute) {
    
  }
  public api = server;
  ngOnInit() {
    this.loadScript("../../../assets/menu.js");
    this.route.params.subscribe(params => {
      this.getMenu({ restoId: params["id"] });
    });
  }
  loadScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
  }
  public menu: Object = {
    _id: String,
    resto: String,
    categories: [
      {
        name: String,
        items: [
          {
            name: String,
            photo: String,
            price: Number,
            desc: String
          }
        ]
      }
    ]
  };
  getMenu(resto) {
    this.service.getMenu(resto).subscribe(
      data => {
        if (data) {
          this.menu = data.body;
          console.log(this.menu);
        }
      },
      err => {
        if (err.error.error) {
          alert(err.error.error);
        } else {
          alert("FAILED PROCESS TRY AGAIN OR LATER");
        }
      }
    );
  }
  deleteCategory(restoId: string, catId: string) {
    this.service
      .deleteCategory({ resto_id: restoId, category_id: catId })
      .subscribe(
        data => {
          location.reload();
        },
        err => {
          if (err.error.error) {
            alert(err.error.error);
          } else {
            alert("FAILED PROCESS TRY AGAIN OR LATER");
          }
        }
      );
  }
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
