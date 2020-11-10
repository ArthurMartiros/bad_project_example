import { Component, OnInit, Input } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  @Input() tempAttr: string[] = [];
  restos: [];
  constructor(private service: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadScript("../../../assets/menu.js");
    this.service
      .getAllRestourants(localStorage.getItem("resto-user_id"))
      .subscribe(
        result => {
          this.restos = result.restos;
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
  loginWithPassword(id) {
    console.log(id, "id");
  }

  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
  loadScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
  }
}
