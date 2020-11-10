import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import {server} from "../../configs/api";
@Component({
  selector: "app-edit-resto-info",
  templateUrl: "./edit-resto-info.component.html",
  styleUrls: ["./edit-resto-info.component.css"]
})
export class EditRestoInfoComponent implements OnInit {
  constructor(
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
    this.route.params.subscribe(params => {
      this.service.getResto(params["id"]).subscribe(result => {
        this.result = result;
        this.result["email"].join();
        this.result["phone"].join();
      });
    });

    this.loadScript("../../../assets/menu.js");
  }
  loadScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
  }

  updateResto(email: string, name: string, phone: string) {
    let categoryChilds = document
      .getElementsByTagName("form")[0]
      .getElementsByTagName("input");
    let formDataInstance = new FormData();

    for (
      let i = 0, catChildLength = categoryChilds.length;
      i < catChildLength;
      ++i
    ) {
      if (categoryChilds[i].type == "file") {
        Array.from(categoryChilds[i].files).forEach(f =>
          formDataInstance.append("logo", f, "resto_logo")
        );
      }
    }
    this.route.params.subscribe(params => {
      formDataInstance.append(
        "query",
        JSON.stringify({
          admin: localStorage.getItem("resto-user_id"),
          resto_id: params["id"]
        })
      );
    });

    formDataInstance.append("token", localStorage.getItem("token"));

    let emails = email
      .replace(/\s/g, "")
      .split(",")
      .filter(el => {
        return el != "";
      });
    let phones = phone
      .replace(/\s/g, "")
      .split(",")
      .filter(el => {
        return el != "";
      });
    formDataInstance.append(
      "object",
      JSON.stringify({
        name: name,
        email: emails,
        phone: phones
      })
    );
    this.route.params.subscribe(params => {
      this.service.updateResto(formDataInstance).subscribe(
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
    });
  }
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
