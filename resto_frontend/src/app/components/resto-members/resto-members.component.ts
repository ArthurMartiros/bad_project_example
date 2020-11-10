import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../admin.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Result } from "range-parser";
import { Observable } from "rxjs";
import { database } from "firebase";
@Component({
  selector: "app-resto-members",
  templateUrl: "./resto-members.component.html",
  styleUrls: ["./resto-members.component.css"]
})
export class RestoMembersComponent implements OnInit {
  constructor(
    private service: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  result: Object = {
    admins: Array,
    _id: String
  };
  public roles = [
    { name: "administrator", value: 1 },
    { name: "manager", value: 2 },
    { name: "waiter", value: 3 }
  ];
  verifiedMap = {
    true: "Verified",
    false: "Not Verified"
  };

  ngOnInit() {
    this.loadScript("../../../assets/menu.js");
    this.route.params.subscribe(params => {
      this.service.getRestoMembers(params["id"]).subscribe(
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
  updateRestoMember(member_id: string, role: number) {
    let data = {
      member_id: member_id,
      role: +role
    };
    this.service.updateRestoMember(data).subscribe(
      result => {
        location.reload();
      },
      err => {
        console.error(err);
        if (err.status == 401) {
          alert(
            "Permission Denied. You Can not Change Your Role Apeeeeeeeeerrrrrrrrrrr"
          );
        } else {
          if (err.error.error) {
            alert(err.error.error);
          } else {
            alert("FAILED PROCESS TRY AGAIN OR LATER");
          }
        }
      }
    );
  }
  addMemberToResto(name: string, phone: string, role: number) {
    let obj = {
      name: name,
      phone: phone,
      role: +role
    };
    this.route.params.subscribe(params => {
      this.service.addMemberToResto(params["id"], obj).subscribe(
        result => {
          console.log(result);
          location.reload();
        },
        err => {
          console.error(err);
          if (err.status == 401) {
            alert(
              "Permission Denied. You Can not Add Member Greater Then Your Role Apeeeeeeeeerrrrrrrrrrr"
            );
          } else {
            if (err.error.error) {
              alert(err.error.error);
            } else {
              alert("FAILED PROCESS TRY AGAIN OR LATER");
            }
          }
        }
      );
    });
  }
  deleteMemberFromResto(member_id: string) {
    this.service.deleteMemberFromResto(member_id).subscribe(
      result => {
        console.log(result);
        location.reload();
      },
      err => {
        console.error(err);
        if (err.status == 401) {
          alert(
            "Permission Denied. You Can not Add Member Greater Then Your Role Apeeeeeeeeerrrrrrrrrrr"
          );
        } else {
          if (err.error.error) {
            alert(err.error.error);
          } else {
            alert("FAILED PROCESS TRY AGAIN OR LATER");
          }
        }
      }
    );
  }
  logout() {
    localStorage.removeItem("resto-user_id");
    localStorage.removeItem("token");
  }
}
