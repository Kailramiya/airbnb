const { error } = require("console");
const Home = require("../models/home");
const user = require("../models/user");
const {check, validationResult} = require("express-validator");
const FileSystem = require("fs");
exports.getAddHome = (req, res, next) => {
  console.log("Came to add home");
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user || {}, 
    errors: [],
    oldInput: {
      houseName: "",
      price: "",
      location: "",
      rating: "",
      description: "",
    },
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }
    
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user || {}, 
      errors: [],
      oldInput: {
        houseName: home.houseName,
        price: home.price,
        location: home.location,
        rating: home.rating,
        description: home.description,
      },
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user || {}, // Use session user or empty object
    });
  });
};

exports.postAddHome = [
  
  check("houseName")
  .notEmpty()
  .withMessage("House name is required")
  .trim()
    .isLength({ min: 3 })
    .withMessage("House name must be at least 3 characters long"),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  check("location")
    .notEmpty()
    .withMessage("Location is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Location must be at least 3 characters long"),
    
    check ("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
    async (req, res, next) =>  {
      
      const { houseName, price, location, rating, description } =
      req.body;
      const errors = validationResult(req);
      console.log(errors);
  if (errors.isEmpty()) {
    
    const photo = req.file.path; // Assuming you are using multer to handle file uploads
    const home = new Home({
      houseName,
      price,
      location,
      rating,
      photo,
      description,
    });
    errors : errors.array().map(e => e.msg),
     home.save().then(() => {
      console.log("Home Saved successfully");
    });
    
    res.redirect("/host/host-home-list");
  }
  else {
    console.log("Error while adding home ", errors.array());
    res.render("host/edit-home", {
      pageTitle: "Add Home to airbnb",
      currentPage: "addHome",
      editing: false,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user || {}, 
      errors : errors.array().map(e => e.msg),
      oldInput: {
        houseName: houseName,
        price: price,
        location: location,
        rating: rating,
        description: description,
      },
    });
  }
}
];






exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating,  description } =
    req.body;
    
    // Check if a new photo was uploaded
    Home.findById(id).then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      if(req.file) {
        FileSystem.unlink(home.photo, (err) => {
        var photo = req.file.path; // Assuming you are using multer to handle file uploads
        if (err) {
          console.log("Error while deleting old photo: ", err);
        } 
        home.photo = photo; // Update photo only if a new one was uploaded
      })
    };
    home.rating = rating;
    
    
    home.description = description;
    home.save().then((result) => {
      console.log("Home updated ", result);
    }).catch(err => {
      console.log("Error while updating ", err);
    })
    res.redirect("/host/host-home-list");
  }).catch(err => {
    console.log("Error while finding home ", err);
  });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};
