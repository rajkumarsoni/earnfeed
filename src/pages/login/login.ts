import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import firebase from "firebase";
@IonicPage({
  name: "app-login-page"
})
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  goToSignUpPage() {
    this.navCtrl.push("app-sign-up-page");
  }
}
