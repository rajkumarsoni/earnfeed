import { Component } from "@angular/core";
import { NavController, LoadingController, ToastController } from "ionic-angular";
import firebase from "firebase";
import moment from 'moment';
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;

  /** @ignore */
  constructor(public navCtrl: NavController, private loadinController: LoadingController, private toastController: ToastController) {
    this.getPosts();
  }

  /**
   * This method is used for posting users feed.
   */
  post() {
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    })
      .then((doc) => {
        console.log("post", doc);
        setTimeout(() => {
          this.toastController.create({
            message: "posted",
            duration: 3000
          }).present();
          this.text = '';
          this.getPosts();
        }, 1000);

      }).catch((error) => {
        console.log("post", error)
      })
  }

  /**
   * This method is used for getting posts form firebase.
   */
  getPosts() {
    this.posts = [];
    let loading = this.loadinController.create({
      content: "loading feed...S"
    });
    loading.present();
    let query = firebase.firestore().collection("posts").orderBy('created', 'desc').limit(this.pageSize);
    query.onSnapshot((snapshot) => {
      console.log(snapshot);
      let changedDocs = snapshot.docChanges();
      changedDocs.forEach((changedDoc) => {
        if (changedDoc.type == "added") { }
        if (changedDoc.type == "modified") { }
        if (changedDoc.type == "removed") { }
      })
    })
    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(doc);
        })
        loading.dismiss();
        this.cursor = this.posts[this.posts.length - 1];

        for (let i = 0; i <= this.posts.length; i++) {
          console.log(i, this.posts[i].data().created.toDate());
        }
        console.log(this.posts);
      }).catch((error) => {
        console.log(error);
      })
  }

  /**
   *
   * @param time
   */
  ago(time) {
    let diffrence = moment(time).diff(moment());
    return moment.duration(diffrence).humanize();
  }

  /**
   *
   * @param event
   */
  loadMorePosts(event) {

    firebase.firestore().collection("posts").orderBy('created', 'desc').startAfter(this.cursor).limit(this.pageSize).get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(doc);
        })
        console.log(this.posts);

        if (docs.size < this.pageSize) {
          event.enable(false);
          this.infiniteEvent = event;
        } else {
          event.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }
      }).catch((error) => {
        console.log(error);
      })
  }

  /**
   *
   * @param event
   */
  refresh(event) {
    this.getPosts();
    event.complete();
    if (this.infiniteEvent) {
      this.infiniteEvent.enable(true);
    }
  }

  logOut() {
    firebase.auth().signOut().then(() => {
      this.toastController.create({
        message: "logout",
        duration: 3000
      }).present();
      this.navCtrl.setRoot('app-login-page');
    });
  }
}
