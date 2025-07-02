const User = require("../models/user");
const Home = require("../models/home");

exports.getIndex = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user || {}, // Use session user or empty object
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user || {}, // Use session user or empty object
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user || {}, // Use session user or empty object
  });
};

exports.getFavouriteList = async (req, res, next) => {

  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourite'); // Use session user or empty object
  

  
   
    res.render("store/favourite-list", {
      favouriteHomes: user.favourite || [], // Use session user or empty array if no favourites
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user || {}, // Use session user or empty object
    });
  
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user =await User.findById(userId); 
  if(!user.favourite.includes(homeId)){
    user.favourite.push(homeId);
    await user.save();
  }
  else{
    console.log("Already marked as favourite");
  }
  return res.redirect("/favourites");

};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourite.includes(homeId)) {
    user.favourite = user.favourite.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
  
    
  
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user || {}, // Use session user or empty object
      });
    }
  });
};

exports.getHouseRules = (req, res, next) => {
  const homeId = req.params.homeId;
  if(!req.session.isLoggedIn){
    return res.redirect("/login");
  }

  Home.findById(homeId).then((home) => {
    
      res.download(home.homeRules, "house-rules.pdf", (err) => {
        if (err) {
          console.error("Error downloading house rules:", err);
          res.redirect("/homes");
        }
      });
    
  });
};
