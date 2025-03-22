const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("PRODUCTS").get();
    if (snapshot.empty) return res.json([]);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos", error: error.message });
  }
});

// Obtener un solo producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("PRODUCTS").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener producto", error: error.message });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { name, description, category, image } = req.body;

    if (!name || !category) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    const newProduct = {
      name,
      description,
      category,
      image: image || "", // Guarda la imagen en Base64 o deja un string vacío
      createdAt: new Date(),
    };

    const docRef = await db.collection("PRODUCTS").add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar producto", error: error.message });
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, image } = req.body;

    if (!name || !category) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    const updateData = { name, description, category };
    if (image) updateData.image = image; // Solo actualiza la imagen si hay una nueva

    await db.collection("PRODUCTS").doc(id).update(updateData);
    res.json({ msg: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar producto", error: error.message });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("PRODUCTS").doc(id).delete();
    res.json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar producto", error: error.message });
  }
});

module.exports = router;
