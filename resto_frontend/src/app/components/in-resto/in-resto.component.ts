import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { server } from "../../configs/api";

import { Observable } from "rxjs";

@Component({
  selector: "app-in-resto",
  templateUrl: "./in-resto.component.html",
  styleUrls: ["./in-resto.component.css"]
})
export class InRestoComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private service: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  public api = server;
  public result: Object = {
    admins: [],
    disable: Boolean,
    email: [],
    key: String,
    menu: String,
    name: String,
    phone: [],
    photos: [],
    tables: [],
    _id: String
  };
  ngOnInit() {
    this.loadScript("../../../assets/scriptfile.js");

    this.loadScript("../../../assets/menu.js");
    this.route.params.subscribe(params => {
      this.service.getResto(params["id"]).subscribe(
        result => {
          this.result = result;
          console.log(result);
        },
        err => {
          if (err.error.error) {
            alert(err.error.error);
          } else {
            alert("FAILED PROCESS TRY AGAIN OR LATER");
          }
        }
      );
    });
  }

  loadScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
  }

  createMenu(currency: string) {
    console.log(currency);
    this.route.params.subscribe(
      params => {
        this.service.createMenu(params["id"], currency).subscribe(
          result => {
            console.log(result);
            location.reload();
          },
          err => {
            alert(err.error.error);
          }
        );
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
  createTable(No: number) {
    this.route.params.subscribe(async params => {
      const result = await this.service.createTable(params["id"], +No);
      result.subscribe(
        data => {
          console.log(data.status);
          setTimeout(function() {
            location.reload();
          }, 200);
        },
        err => {
          if (err.error.error) {
            alert(err.error.error);
          } else {
            alert("FAILED PROCESS TRY AGAIN OR LATER");
          }
        }
      );
    });
  }
  deleteTable(table_id: string) {
    this.route.params.subscribe(async params => {
      const result = await this.service.deleteTable(params["id"]);
      result.subscribe(
        () => {
          setTimeout(function() {
            location.reload();
          }, 200);
        },
        err => {
          if (err.error.error) {
            alert(err.error.error);
          } else {
            alert("FAILED PROCESS TRY AGAIN OR LATER");
          }
        }
      );
    });
  }
  downloadQr(table_qr: string) {
    this.service.downloadQr(table_qr).subscribe(data => {
      const blob = new Blob([data], { type: "image/jpeg" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
