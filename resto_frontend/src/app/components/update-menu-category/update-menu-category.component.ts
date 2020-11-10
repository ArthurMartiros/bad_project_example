import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import {server} from "../../configs/api";

@Component({
  selector: "app-update-menu-category",
  templateUrl: "./update-menu-category.component.html",
  styleUrls: ["./update-menu-category.component.css"]
})
export class UpdateMenuCategoryComponent implements OnInit {
  constructor(
    private service: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  public api = server;
  ngOnInit() {
    this.loadScript("../../../assets/scriptfile.js");
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
  removableItems: Array<Object> = [];
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
  removeItems(obj) {
    console.log(obj);
    this.removableItems.push(obj);
    console.log(this.removableItems);
  }
  uploadAndProgress() {
    var categoryChilds = document
        .getElementsByClassName("For-append-category")[0]
        .getElementsByTagName("input"),
      childs = document.getElementsByClassName("For-append")[0].children,
      Existchilds = document.getElementsByClassName("For-exist"),
      formDataInstance = new FormData();
    console.log("Exxxxxxxxxxxxx: ", Existchilds);
    console.log("Childsssssss: ", childs);
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

    for (let i = 0; i < Existchilds.length; ++i) {
      let existChildSub = document.getElementsByClassName("For-exist")[i]
        .children;
      for (let x = 0; x < existChildSub.length; ++x) {
        let el = existChildSub[x].getElementsByTagName("input");

        // console.log("elllllllllllllll222222222222222: ",el);

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
    }

    for (let i = 0, childLength = childs.length; i < childLength; ++i) {
      let el = childs[i].getElementsByTagName("input");
      // console.log("elllllllllllllll: ",el);

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

    console.log("ItemName:---------------: ", formDataInstance.getAll("name"));
    console.log("Item Price:_-----------: ", formDataInstance.getAll("price"));
    console.log("Item Desc:_-----------: ", formDataInstance.getAll("desc"));

    console.log(
      "itemPhoto:-------------: ",
      formDataInstance.getAll("itemPhoto")
    );
    console.log(
      "itemPhotoName:-------------: ",
      formDataInstance.getAll("itemPhotoName")
    );

    console.log(
      "categoryPhoto:----------------------: ",
      formDataInstance.get("categoryPhoto")
    );
    console.log(
      "categoryName: -------------: ",
      formDataInstance.get("categoryName")
    );
    console.log("ItemID: -------------: ", formDataInstance.getAll("itemId"));
    console.log("photoID: -------------: ", formDataInstance.getAll("photoId"));

    this.route.params.subscribe(params => {
      formDataInstance.append("resto_id", params["id"]);
      formDataInstance.append("catId", params["catId"]);
    });
    formDataInstance.append(
      "query",
      JSON.stringify({ admin: localStorage.getItem("resto-user_id") })
    );
    formDataInstance.append("token", localStorage.getItem("token"));
    console.log(
      "ffffffffffffffffffffffffinalllllllyyyyyyyyyyyyyy: ",
      formDataInstance
    );

    this.updateCategory(formDataInstance);
  }

  updateCategory(item) {
    this.service.updateCategory(item).subscribe(
      event => {
        console.log(event);
        this.route.params.subscribe(params => {
          // this.router.navigate(['admin/show_menu/'+params['id']]);
          location.reload();
        });
      },
      error => {
        if (error.error.error) {
          alert(error.error.error);
        } else {
          alert("FAILED PROCESS TRY AGAIN OR LATER");
        }
        // console.log(error, 'errr');
      }
    );
  }
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
