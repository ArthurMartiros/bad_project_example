import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin-credentials",
  templateUrl: "./admin-credentials.component.html",
  styleUrls: ["./admin-credentials.component.css"]
})
export class AdminCredentialsComponent implements OnInit {
  constructor(private service: AdminService, private router: Router) {}
  result: Object = {
    name: String,
    fb_id: String,
    role: Number,
    phone: String,
    key: String,
    verified: Boolean
  };
  rolesMap = {
    "1": "administrator",
    "2": "mnager",
    "3": "waiter"
  };
  verifiedMap = {
    true: "Verified",
    false: "Not Verified"
  };
  ngOnInit() {
    this.loadScript("../../../assets/menu.js");

    this.getUser();
  }

  getUser() {
    this.service.getUser().subscribe(
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
  }
  updateUser(
    name: string,
    phone: string,
    password: string,
    re_password: string
  ) {
    this.service
      .updateUser({
        name: name,
        phone: phone,
        password: password,
        re_password: re_password
      })
      .subscribe(
        result => {
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
  loadScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
  }
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
