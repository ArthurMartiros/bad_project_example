import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-create-resto",
  templateUrl: "./create-resto.component.html",
  styleUrls: ["./create-resto.component.css"]
})
export class CreateRestoComponent implements OnInit {
  constructor(
    private service: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadScript("../../../assets/menu.js");
  }
  createResto(email: string, name: string, phone: string) {
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
    formDataInstance.append(
      "query",
      JSON.stringify({
        admin: localStorage.getItem("resto-user_id")
      })
    );

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
    this.service.createResto(formDataInstance).subscribe(
      result => {
        this.router.navigate(["/admin"]);
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
