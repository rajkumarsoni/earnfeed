import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController, ToastController } from "ionic-angular";
import firebase from "firebase";
import { HomePage } from "../home/home";
import { HttpClient } from "@angular/common/http";
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
    refer: string = '';

    constructor(public navCtrl: NavController,private http: HttpClient, public navParams: NavParams, private alertController: AlertController, private toastController: ToastController) { }

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
                console.log('fdfdf',data);
                firebase.firestore().collection("users").add({
                    created: firebase.firestore.FieldValue.serverTimestamp(),
                    owner: firebase.auth().currentUser.uid,
                    owner_name: firebase.auth().currentUser.displayName,
                    referId : this.refer
                });
                
                firebase.firestore().collection("users").get().then((data)=>{
                    for(let i = 0; i< data.docs.length; i++){
                        if(data.docs[i].id === this.refer){
                            console.log('ssssssssssssssssssss', data.docs[i].id);
                            this.like(data.docs[i].id);
                        }
                    }
                })
                
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
    like(referId){
		let body = {
            userId: this.refer,
            referId: referId
			
		}

		

		this.http.post('https://us-central1-earnbyfeed.cloudfunctions.net/updateLikesCount', JSON.stringify(body))
		.subscribe((data)=>{
			console.log(data)
		}, (error)=>{
			console.log(error)
		})
    }
    getAction(post){
		if(post.data().likes && post.data().likes[firebase.auth().currentUser.uid] == true){ 
			console.log(post.data().likes[firebase.auth().currentUser.uid])
			return 'unlike'
		}else{
			return 'like'
		}
	}
}
