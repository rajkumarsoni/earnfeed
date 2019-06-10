import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const updateLikesCount = functions.https.onRequest((req: any, res: any) => {

    const a = JSON.parse(req.body)
    console.log(a)
    const postId = a.referId;
    console.log(a.postId);
    const abc = admin.firestore().collection('users');
    abc.doc(postId).get().then((data: any) => {

        let referCoins = data.data().refredCoins || 0;
        const updateData: any = {};
        updateData[`refredCoins`] = referCoins + 1000

        let level2 = data.data().referId;


        abc.doc(level2).get().then((data: any) => {
            let referCoinss = data.data().refredCoins || 0;
            const updateLevel2Data: any = {};
            updateLevel2Data[`refredCoins`] = referCoinss + 500;


            abc.doc(postId).update(updateData).then(() => {
                abc.doc(level2).update(updateLevel2Data).then(() => {
                    res.status(200).send('Done')
                }).catch((err) => {
                    res.status(err.code).send(err.message)
                })

            }).catch((err) => {
                res.status(err.code).send(err.message)
            })

        })





    })
})
