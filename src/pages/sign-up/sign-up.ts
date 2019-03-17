import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import firebase from "firebase";
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

    constructor(public navCtrl: NavController, public navParams: NavParams) { }

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
                    })
                    .catch(err => {
                        console.log("err", err);
                    });
                console.log(data);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }
    goToLoginPage() {
        this.navCtrl.pop();
    }
}
