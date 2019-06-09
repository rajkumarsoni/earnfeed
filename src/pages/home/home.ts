import { Component } from "@angular/core";
import { NavController, LoadingController, ToastController, Thumbnail } from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera';


import firebase from "firebase";
import moment from 'moment';
import { HttpClient } from "@angular/common/http";
@Component({
	selector: "page-home",
	templateUrl: "home.html"
})
export class HomePage {
	text: string = "";
	posts: any[] = [];
	pageSize: number = 10;
	cursor: any;
	image: string;
	infiniteEvent: any;

	/** @ignore */
	constructor(
		private camera: Camera,
		private http: HttpClient,
		public navCtrl: NavController, private loadinController: LoadingController, private toastController: ToastController) {
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
				if (this.image) {
					this.upload(doc.id).then(() => {
						this.text = "";
						this.image = undefined;
						console.log("post", doc);
						setTimeout(() => {
							this.toastController.create({
								message: "posted",
								duration: 3000
							}).present();
							this.text = '';
							this.getPosts();
						}, 1000);
					});
				} else {
					this.text = "";
					this.image = undefined;
					console.log("post", doc);
					setTimeout(() => {
						this.toastController.create({
							message: "posted",
							duration: 3000
						}).present();
						this.text = '';
						this.getPosts();
					}, 1000);
				}
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
				if (changedDoc.type == "modified") { 
					for(let i = 0; i< this.posts.length; i++){
						if(this.posts[i].id == changedDoc.doc.id){
							this.posts[i] = changedDoc.doc;
						}
					}
				 }
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

	addPhoto() {
		let options = {
			quality: 100,
			sourceType: this.camera.PictureSourceType.CAMERA,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.PNG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true,
			targetHeight: 512,
			targetWidth: 512,
			allowEdit: true,
		}
		this.camera.getPicture(options).then((base64Image) => {
			console.log(base64Image);
			this.image = "data:image/png;base64," + base64Image;
		}).catch((err) => {
			console.log(err);
		})
	}
	upload(name: string) {

		return new Promise((resolve, reject) => {
			let loadigCtrl = this.loadinController.create({
				content: "uploading image...."
			})
			loadigCtrl.present();

			let ref = firebase.storage().ref("postImages/" + name);
			let uploadTask = ref.putString(this.image.split(',')[1], "base64");
			uploadTask.on('state_changed', (taskSnapshort) => {
				let percentage = (taskSnapshort.bytesTransferred / taskSnapshort.totalBytes) * 100;
				loadigCtrl.setContent('Uploading ' + percentage + "%");

				console.log(taskSnapshort);
			}, (error) => {
				console.log(error)
			}, () => {
				console.log('complete');
				uploadTask.snapshot.ref.getDownloadURL().then((url) => {
					console.log(url);
					firebase.firestore().collection("posts").doc(name).update({
						image: url
					}).then(() => {
						loadigCtrl.dismiss();
						resolve();
					}).catch((err) => {
						loadigCtrl.dismiss();
						reject();
					})
				}).catch(() => {
					loadigCtrl.dismiss();
					reject()
				})

			})
		})


	}

	like(post){
		let body = {
			postId: post.id,
			userId: firebase.auth().currentUser.uid,
			action: this.getAction(post)
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