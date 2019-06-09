import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const updateLikesCount = functions.https.onRequest((req:any, res:any) => {
    
    console.log(req.body.postId);
    const a =JSON.parse(req.body)
    console.log(a)
    const postId = a.postId;
    const userId = a.userId;
    const action = a.action;  //like or unlike
   console.log(a.postId);
   console.log(a);
   console.log(userId);
   console.log(action);

    console.log(req);
    admin.firestore().collection('posts').doc(postId).get().then((data: any)=>{
    
        let likesCount = data.data().likesCount || 0;
        let likes  = data.data().likes || [];

        const updateData: any = {};

        if(action === 'like'){
            updateData['likesCount'] = ++likesCount;
            updateData[`likes.${userId}`] = true;
        }else{
            updateData['likesCount'] = --likesCount;
            updateData[`likes.${userId}`] = false;
        }

        admin.firestore().collection('posts').doc(postId).update(updateData).then(()=>{
            res.status(200).send('Done')
        }).catch((err)=>{
            res.status(err.code).send(err.message)
        })

    })
})
