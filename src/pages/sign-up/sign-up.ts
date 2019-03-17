import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController, ToastController } from "ionic-angular";
import firebase from "firebase";
import { HomePage } from "../home/home";
@IonicPage({
    name: "app-sign-up-page"
})
@Component({
    selector: "page-sign-up",
    templateUrl: "sign-up.html"
})
export class SignUpPage {
    name: string = "";
    email: string = "";
    password: string = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertController: AlertController, private toastController: ToastController) { }

    ionViewDidLoad() {
        console.log("ionViewDidLoad SignUpPage");
    }

    signUp() {
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((data: any) => {
                let newUser: firebase.User = data.user;
                newUser
                    .updateProfile({
                        displayName: this.name,
                        photoURL: ""
                    })
                    .then(res => {
                        console.log("res", res);
                        this.alertController.create({
                          title: "COngo",
                          message: "welcom",
                          buttons: [{
                            text: "ok",
                            handler: ()=>{
                              this.goToHomePage();
                            }
                          }]
                        }).present();
                    })
                    .catch(err => {
                        console.log("err", err);
                    });
                console.log(data);
            })
            .catch((error: any) => {
                console.log(error);
                this.toastController.create({
                  message: error.message,
                  duration: 3000
              }).present();
            });
    }
    goToLoginPage() {
        this.navCtrl.pop();
    }
    goToHomePage(){
      this.navCtrl.setRoot(HomePage);
    }
}
