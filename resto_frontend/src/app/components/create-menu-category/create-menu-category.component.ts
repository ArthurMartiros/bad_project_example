import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-create-menu-category",
  templateUrl: "./create-menu-category.component.html",
  styleUrls: ["./create-menu-category.component.css"]
})
export class CreateMenuCategoryComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private service: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadScript("../../../assets/scriptfile.js");
    this.loadScript("../../../assets/menu.js");

    // this.route.params.subscribe(params => {
    //   this.service.getResto(params['id']).subscribe((result) => {
    //       console.log(result);
    //   });
    // });
  }

  uploadAndProgress() {
    var categoryChilds = document
        .getElementsByClassName("For-append-category")[0]
        .getElementsByTagName("input"),
      childs = document.getElementsByClassName("For-append")[0].children,
      formDataInstance = new FormData();

    for (
      let i = 0, catChildLength = categoryChilds.length;
      i < catChildLength;
      ++i
    ) {
      if (categoryChilds[i].type == "file") {
        Array.from(categoryChilds[i].files).forEach(f =>
          formDataInstance.append(
            "categoryPhoto",
            f,
            Date.now() + "gago" + Math.floor(Math.random() * 200000)
          )
        );
      } else {
        formDataInstance.append("categoryName", categoryChilds[i].value);
      }
    }

    for (let i = 0, childLength = childs.length; i < childLength; ++i) {
      let el = childs[i].getElementsByTagName("input");
      let obj = {};
      let name;

      for (let j = el.length - 1; j > -1; --j) {
        if (el[j].type != "file") {
          obj[el[j].name] = el[j].value;
          formDataInstance.append(el[j].name, el[j].value);
        } else {
          if (el[j].files[0]) {
            console.log("Original: ", el[j].files[0].name);
            let renameIt =
              Date.now() + "gago" + Math.floor(Math.random() * 200000);
            formDataInstance.append("itemPhoto", el[j].files[0], renameIt);
            formDataInstance.append("itemPhotoName", renameIt);
          } else {
            obj["photo"] = null;
            formDataInstance.append("itemPhoto", null);
            formDataInstance.append("itemPhotoName", null);
          }
        }
      }
    }
    // console.log("ItemName:---------------: ",formDataInstance.getAll('name'));
    // console.log("Item Price:_-----------: ",formDataInstance.getAll('price'));
    // console.log("Item Desc:_-----------: ",formDataInstance.getAll('desc'));

    // console.log("itemPhoto:-------------: ",formDataInstance.getAll('itemPhoto'));
    // console.log("itemPhotoName:-------------: ",formDataInstance.getAll('itemPhotoName'));

    // console.log("categoryPhoto:----------------------: ",formDataInstance.get('categoryPhoto'));
    // console.log("categoryName: -------------: ",formDataInstance.get('categoryName'))

    // console.log('ffffffffffffffffffffffffinalllllllyyyyyyyyyyyyyy: ', formDataInstance);
    this.route.params.subscribe(params => {
      formDataInstance.append("resto_id", params["id"]);
    });
    formDataInstance.append(
      "query",
      JSON.stringify({ admin: localStorage.getItem("resto-user_id") })
    );
    formDataInstance.append("token", localStorage.getItem("token"));
    this.createCategory(formDataInstance);
  }

  createCategory(item) {
    this.service.createCategory(item).subscribe(
      event => {
        console.log(event);
        this.route.params.subscribe(params => {
          this.router.navigate(["admin/show_menu/" + params["id"]],{queryParams: {refresh: new Date().getTime()}});
        });
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
