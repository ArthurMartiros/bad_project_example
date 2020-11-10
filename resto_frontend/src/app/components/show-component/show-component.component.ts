import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import {server} from "../../configs/api";

@Component({
  selector: "app-show-component",
  templateUrl: "./show-component.component.html",
  styleUrls: ["./show-component.component.css"]
})
export class ShowComponentComponent implements OnInit {
  constructor(
    private service: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  public api = server; 
  ngOnInit() {
    this.loadScript("../../../assets/menu.js");
    this.route.params.subscribe(params => {
      this.getMenu({ restoId: params["id"], catId: params["catId"] });
    });
  }
  loadScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
  }
  public category: Object = {
    _id: String,

    name: String,
    items: [
      {
        name: String,
        photo: String,
        price: Number,
        desc: String
      }
    ]
  };
  public currency: string = null;

  getMenu(resto) {
    this.service.getMenu(resto).subscribe(
      data => {
        if (data) {
          this.category = data.categories;
          this.currency = data.currency_simbol;
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
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
