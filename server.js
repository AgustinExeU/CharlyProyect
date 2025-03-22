const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");

//const authRoutes = require('./routes/auth');

//const app = express();
const port = 5000;


const serviceAccount = require('./firebaseConfig.json');


if(!admin.apps.length){
  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
}else{
  admin.app();
}



//const db = admin.firestore();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const profileRouter = require('./routes/profile'); 



const app = express();




app.use(cors());
app.use(bodyParser.json());

//app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.use('/api/auth',authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', profileRouter);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
