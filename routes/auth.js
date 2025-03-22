const express = require("express");
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const db = admin.firestore();

// Ruta para registrar un usuario
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, mfaEnabled, securityQuestion, securityAnswer } = req.body;
    console.log("Datos recibidos en el backend:", { email, username, password, mfaEnabled });

    if (!email || !username || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);
    const userRef = await db.collection("USERS").add({
      email,
      username,
      password: hashedPassword,
      mfaEnabled: mfaEnabled || false,
      mfaSecret: mfaEnabled ? speakeasy.generateSecret().base32 : null,
      securityQuestion,
      securityAnswer: hashedSecurityAnswer,
      role: "user", // Por defecto, el rol es 'user'
    });

    const userId = userRef.id;
    console.log("Usuario creado en Firestore con ID:", userId);

    if (mfaEnabled) {
      const secret = speakeasy.generateSecret();
      await db.collection("USERS").doc(userId).update({ mfaSecret: secret.base32 });

      const otpAuthUrl = `otpauth://totp/MyApp:${email}?secret=${secret.base32}&issuer=MyApp`;
      console.log("URL del QR Code generado:", otpAuthUrl);

      qrcode.toDataURL(otpAuthUrl, (err, imageUrl) => {
        if (err) {
          console.error("Error generando QR:", err);
          return res.status(500).json({ msg: "Error generando QR" });
        }
        console.log("QR Code generado correctamente:", imageUrl);
        res.status(201).json({ msg: "Usuario registrado", qrCode: imageUrl, secret: secret.base32 });
      });
    } else {
      console.log("MFA no habilitado. Usuario registrado con éxito.");
      res.status(201).json({ msg: "Usuario registrado con éxito" });
    }
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Ruta para recuperar contraseña
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usersRef = db.collection("USERS");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    let user;
    snapshot.forEach((doc) => (user = { id: doc.id, ...doc.data() }));

    const isMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
    if (!isMatch) {
      return res.status(400).json({ msg: "Respuesta de seguridad incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection("USERS").doc(user.id).update({ password: hashedPassword });

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Ruta para verificar el código MFA
router.post("/verify-mfa", async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log("Datos recibidos en /verify-mfa:", { email, code });

    if (!email || !code) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usersRef = db.collection("USERS");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    let user;
    snapshot.forEach((doc) => (user = { id: doc.id, ...doc.data() }));

    if (!user || !user.mfaSecret) {
      return res.status(400).json({ msg: "Error al recuperar usuario o MFA no configurado" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: "base32",
      token: code,
    });

    if (!verified) {
      return res.status(400).json({ msg: "Código MFA incorrecto" });
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "10m" }
    );

    res.json({ token: jwtToken, userId: user.id, role: user.role, msg: "MFA verificado correctamente" });
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  try {
    const { email, password, token } = req.body;
    console.log("Datos recibidos en el backend:", { email, password, token });

    if (!email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usersRef = db.collection("USERS");
    const snapshot = await usersRef.where("email", "==", email).get();
    console.log("Resultado de la búsqueda en Firestore:", snapshot.empty ? "Usuario no encontrado" : "Usuario encontrado");

    if (snapshot.empty) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    let user;
    snapshot.forEach((doc) => (user = { id: doc.id, ...doc.data() }));
    console.log("Usuario recuperado de Firestore:", user);

    if (!user || !user.password) {
      return res.status(400).json({ msg: "Error al recuperar usuario" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Coincidencia de contraseña:", isMatch ? "Correcta" : "Incorrecta");

    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    if (user.mfaEnabled) {
      if (!token) {
        return res.status(400).json({ msg: "Se requiere MFA" });
      }
      const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: "base32",
        token,
      });
      console.log("Verificación MFA:", verified ? "Correcta" : "Incorrecta");
      if (!verified) {
        return res.status(400).json({ msg: "Código MFA incorrecto" });
      }
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "10m" }
    );
    console.log("JWT generado:", jwtToken);
    res.json({ token: jwtToken, userId: user.id, role: user.role, msg: "Inicio de sesión exitoso" });
  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Ruta protegida para el dashboard
router.get("/dashboard", authMiddleware, (req, res) => {
  if (req.user.role === "admin") {
    res.json({ msg: "Bienvenido al dashboard de administrador" });
  } else {
    res.status(403).json({ msg: "Acceso denegado" });
  }
});

// Ruta protegida para el home
router.get("/home", authMiddleware, (req, res) => {
  if (req.user.role === "user") {
    res.json({ msg: "Bienvenido al home" });
  } else {
    res.status(403).json({ msg: "Acceso denegado" });
  }
});

module.exports = router;