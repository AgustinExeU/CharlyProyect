// scripts/createAdmin.js
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");

const serviceAccount = require("./firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const createAdmin = async () => {
  const email = "admin@gmail.com";
  const username = "admin";
  const password = "admin123";
  const securityQuestion = "What is your favorite color?";
  const securityAnswer = "blue";
  const role = "admin";

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

  await db.collection("USERS").add({
    email,
    username,
    password: hashedPassword,
    securityQuestion,
    securityAnswer: hashedSecurityAnswer,
    role,
  });

  console.log("Admin creado con éxito");
};

createAdmin();