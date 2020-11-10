import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import * as firebase from "firebase";
import { Router } from "@angular/router";
var config = {
  apiKey: "AIzaSyCg_b9BzasyRI7WuFYvAPvIvGA4PRszRNI",
  authDomain: "resto-328bc.firebaseapp.com",
  databaseURL: "https://resto-328bc.firebaseio.com",
  projectId: "resto-328bc",
  storageBucket: "resto-328bc.appspot.com",
  messagingSenderId: "1074798062472"
};
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
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
  windowRef: any;
  phoneNumber: string;
  verificationCode: string;
  user: any;
  render: boolean;

  ngOnInit() {
    console.log("onint");
  }
  sendLoginCode(phone: string) {
    this.phoneNumber = phone;
    const appVerifier = this.windowRef.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phone, appVerifier)
      .then(result => {
        if (result) {
          this.windowRef.confirmationResult = result;
          this.render = true;
        }
      })
      .catch(error => {
        console.log(error)
        alert("FAILED PROCESS MAYBE PHONE NUMBER IS INVALID!");
      });
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
        // console.log(error, "Incorrect code entered?");
        alert("Incorrect code entered");
      });
  }

  register(name: String, password: String, re_password: String) {
    if (password != re_password) {
      alert("Password Not Matching Re-Password");
      return;
    }
    this.authService
      .register({
        object: {
          name: name,
          phone: localStorage.getItem("user_phone"),
          password: password,
          re_password: re_password,
          fb_id: localStorage.getItem("user_fb_uid")
        }
      })
      .subscribe(
        result => {
          console.log(result);
          this.router.navigate([""]);
        },
        err => {
          alert(
            err.error.error +
              " MAYBE THERE ARE SAME PHONE NUMBER TRY ANOTHER NUMBER"
          );
          location.reload();
        }
      );
  }
}
