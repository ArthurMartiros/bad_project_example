import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.component.html",
  styleUrls: ["./order-history.component.css"]
})
export class OrderHistoryComponent implements OnInit {
  constructor(
    private service: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  public orders: any = [];
  ngOnInit() {
    this.loadScript("../../../assets/menu.js");
    this.getOrderHistory();
  }
  loadScript(src) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("body")[0].appendChild(script);
    script.src = src;
  }
  getOrderHistory() {
    this.route.params.subscribe(params => {
      this.service.getOrders({ resto: params["id"] }).subscribe(
        result => {
          this.orders = result;
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
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
