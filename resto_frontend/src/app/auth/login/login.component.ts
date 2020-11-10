import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import * as response from "../../../../response.js";
import { shareReplay, tap } from "rxjs/operators";
import * as moment from "moment";
import * as firebase from "firebase";
var config = {
  apiKey: "AIzaSyCg_b9BzasyRI7WuFYvAPvIvGA4PRszRNI",
  authDomain: "resto-328bc.firebaseapp.com",
  databaseURL: "https://resto-328bc.firebaseio.com",
  projectId: "resto-328bc",
  storageBucket: "resto-328bc.appspot.com",
  messagingSenderId: "1074798062472"
};
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  //  @Input() admin = {
  //   username: '',
  //   password: ''
  // };
  constructor(private authService: AuthService, private router: Router) {
    this.render = false;
    console.log("constructor");
    setTimeout(() => {
      this.windowRef = window;
      if (!this.windowRef.recaptchaVerifier) {
        firebase.initializeApp(config);
      }

      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container"
      );
      this.windowRef.recaptchaVerifier.render();
    }, 0);
  }
  boolForLogin = "phone";
  phone = null;
  who = null;
  render: boolean;
  windowRef: any;
  user: any;

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(
      result => {
        if (result.success) {
          this.router.navigate(["/admin"]);
        } else {
          this.router.navigate([""]);
        }
      },
      err => {
        this.router.navigate([""]);
      }
    );
  }
  loginWithPhone(phone: string): void {
    console.log(phone);
    this.authService
      .login({
        object: { phone: phone }
      })
      .subscribe(
        result => {
          console.log(result.redirect);
          if (result.redirect == response.redirect.set_password) {
            const appVerifier = this.windowRef.recaptchaVerifier;

            this.who = result.data._id;
            firebase
              .auth()
              .signInWithPhoneNumber(phone, appVerifier)
              .then(result => {
                this.boolForLogin = "setP";
                if (result) {
                  this.windowRef.confirmationResult = result;
                  this.render = true;
                  this.phone = phone;
                }
              })
              .catch(error => {
                // console.log(error)
                alert("FAILED PROCESS MAYBE PHONE NUMBER IS INVALID!");
              });
          } else if (result.redirect === response.redirect.send_password) {
            const appVerifier = this.windowRef.recaptchaVerifier;
            appVerifier
              .verify()
              .then(result => {
                if (result) {
                  this.phone = phone;
                  this.boolForLogin = "sentP";
                } else {
                  alert("Verify That You Are Not Robot!");
                }
              })
              .catch(err => {
                alert("Verify That You Are Not Robot!");
              });
          }
        },
        error => {
          console.error(error);
          if(error.error.error){
            alert(error.error.error);

          }else{
            alert("FAILED PROCESS TRY AGAIN OR LATER!");

          }
          // location.reload();
        }
      );
  }
  verifyLoginCode(code: string) {
    this.windowRef.confirmationResult
      .confirm(code)
      .then(result => {
        this.user = result.user;
        localStorage.setItem("user_fb_uid", result.user.uid);
        localStorage.setItem("user_phone", result.user.phoneNumber);
      })
      .catch(error => {
        // console.log(error, "Incorrect code entered?")
        alert("Incorrect code entered");
      });
  }
  registersP(password: string, re_password: string) {
    this.authService
      .updateUser({
        query: { member_id: this.who },
        object: {
          password: password,
          re_password: re_password,
          fb_id: localStorage.getItem("user_fb_uid")
        }
      })
      .subscribe(
        result => {
          if (result.success) {
            localStorage.removeItem("user_fb_uid");
            localStorage.removeItem("user_phone");
            location.reload();
          } else {
            alert("Could Not Login ");
            location.reload();
          }
        },
        err => {
          alert(err.error.error);
          location.reload();
        }
      );
  }
  loginWithPassword(password: string): void {
    this.authService
      .login({
        object: { phone: this.phone, password: password }
      })
      .subscribe(
        result => {
          if (result.success) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("resto-user_id", result.data._id);
            this.router.navigate(["/admin"]);
          } else {
            alert("Could Not Login ");
            location.reload();
          }
        },
        error => {
          alert("Could Not Login");
          location.reload();
        }
      );
  }
  redirectToRegister() {
    this.router.navigate(["/registration"]);
  }
}
