"use strict";
// import * as functions from 'firebase-functions';
Object.defineProperty(exports, "__esModule", { value: true });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore(); // Add this
const app = express();


let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    next();
  }
main.use(allowCrossDomain)

const main = express();
main.use('/api/v1', app);
main.use(bodyParser.json());
exports.webApi = functions.https.onRequest(main);
// app.get('/warmup', (request, response) => {
//     response.send('Warming up friend.');
// })
app.post('/posts', async (request, response) => {
    try {
        const { title, description } = request.body;
        const data = {
            title,
            description
        };
        const fightRef = await db.collection('posts').add(data);
        const fight = await fightRef.get();
        response.json({
            id: fightRef.id,
            data: fight.data()
        });
    }
    catch (error) {
        response.status(500).send(error);
    }
});
app.get('/posts/:id', async (request, response) => {
    try {
        const fightId = request.params.id;
        if (!fightId)
            throw new Error('Fight ID is required');
        const fight = await db.collection('posts').doc(fightId).get();
        if (!fight.exists) {
            throw new Error('Fight doesnt exist.');
        }
        response.json({
            id: fight.id,
            data: fight.data()
        });
    }
    catch (error) {
        response.status(500).send(error);
    }
});
app.get('/posts', async (request, response) => {
    try {
        const fightQuerySnapshot = await db.collection('posts').get();
        let fights = [{}];
        fightQuerySnapshot.forEach((doc) => {
            fights.push({
                id: doc.id,
                data: doc.data()
            });
        });
        response.json(fights);
    }
    catch (error) {
        response.status(500).send(error);
    }
});
//# sourceMappingURL=index.js.map