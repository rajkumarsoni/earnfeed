import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController } from "ionic-angular";
import firebase from "firebase";
import { HomePage } from "../home/home";
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

    constructor(public navCtrl: NavController, public navParams: NavParams, private toastController: ToastController) { }

    ionViewDidLoad() {
        console.log("ionViewDidLoad LoginPage");
    }

    login() {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then((data: any) => {
                console.log(data);
                this.toastController.create({
                    message: "Welcome " + data.user.displayName,
                    duration: 3000
                }).present();
                this.goToHomePage();
            })
            .catch((error: any) => {
                this.toastController.create({
                    message: error.message,
                    duration: 3000
                }).present();
            });
    }

    goToSignUpPage() {
        this.navCtrl.push("app-sign-up-page");
    }

    goToHomePage(){
      this.navCtrl.setRoot(HomePage);
    }
}
