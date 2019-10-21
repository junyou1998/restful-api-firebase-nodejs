// import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore(); // Add this
const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

// app.get('/warmup', (request, response) => {

//     response.send('Warming up friend.');

// })

app.post('/posts', async (request, response) => {
    try {
        const { title, description } = request.body;
        const data = {
        
            title,
            description
        }
        const fightRef = await db.collection('posts').add(data);
        const fight = await fightRef.get();

        response.json({
            id: fightRef.id,
            data: fight.data()
        });

    } catch (error) {

        response.status(500).send(error);

    }
});

app.get('/posts/:id', async (request, response) => {
    try {
        const fightId = request.params.id;

        if (!fightId) throw new Error('Fight ID is required');

        const fight = await db.collection('posts').doc(fightId).get();

        if (!fight.exists) {
            throw new Error('Fight doesnt exist.')
        }

        response.json({
            id: fight.id,
            data: fight.data()
        });

    } catch (error) {

        response.status(500).send(error);

    }

});


app.get('/posts', async (request, response) => {
    try {

        const fightQuerySnapshot = await db.collection('posts').get();
        let fights=[{}];
        fightQuerySnapshot.forEach(
            (doc) => {
                fights.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );

        response.json(fights);

    } catch (error) {

        response.status(500).send(error);

    }

});