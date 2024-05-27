const fs = require("fs");
const targetPath = "./src/environments/environment.ts";
const targetDevPath = "./src/environments/environment.development.ts";
require("dotenv").config();

function makeConfig(prod = false) {
    return `
export const environment = {
    production: ${prod},
    firebase: {
        apiKey: "${process.env["FIREBASE_API_KEY"]}",
        authDomain: "firemusic-82e06.firebaseapp.com",
        projectId: "firemusic-82e06",
        storageBucket: "firemusic-82e06.appspot.com",
        messagingSenderId: "${process.env["FIREBASE_MESSAGING"]}",
        appId: "${process.env["FIREBASE_APP_ID"]}",
        measurementId: "${process.env["FIREBASE_MEASUREMENT_ID"]}",
    },
};
`;
}
fs.writeFileSync(targetPath, makeConfig(true), "utf8");
fs.writeFileSync(targetDevPath, makeConfig(), "utf8");
