const fs = require("fs");
const targetPath = "./src/environments/environment.ts";
require("dotenv").config();
const environmentFileContent = `
export const environment = {
    production: true,
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
fs.writeFileSync(targetPath, environmentFileContent, "utf8");
