

// External Module
const express = require('express');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const authRouter = require("./routes/authRouter");

const errorsController = require("./controllers/errors");
const session = require('express-session');
const { default: mongoose } = require('mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const DB_PATH = "mongodb+srv://amankundu:MongoDb12345@cluster0.ismomzo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const bodyParser = require('body-parser');
const multer = require('multer');

const randomString = (length) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const storage= multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10).replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
};


const multerOptions = {
  storage: storage,
  fileFilter: fileFilter,
};  

app.use(multer(multerOptions).single('photo'));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: 'sessions',
});


app.use(session({
  secret:
    'airbnb clone',
  resave: false,
  saveUninitialized: true,
  store: store,
}));


app.use((req,res,next)=>{
  req.isLoggedIn=req.session.isLoggedIn ||false;

  next();
})


app.use(bodyParser.urlencoded({ extended: true }));
app.use(storeRouter);
app.use(authRouter);
app.use("/host", (req, res, next) => {
  if(!req.isLoggedIn ) {
    res.redirect("/login",
      {
        pageTitle: "Login",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["You must be logged in to access this page."],
        oldInput: {
          email: "",
        },
      }
    );
    return;
  }
  next();
});
app.use("/host", hostRouter);



app.use(errorsController.pageNotFound);

const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
  console.log('Connected to Mongo');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongo: ', err);
});
