var express = require("express");
const axios = require("axios");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { Title: "Image Style Changer", result: false });
  //res.render('index', { title: 'Express', parm1: "paiiiiam"});
  // 'index' is in the view
  // title show on the page
  // const url = 'https://kctbh9vrtdwd.statuspage.io/api/v2/status.json';
  // axios.get(url)
  //     .then( (response) => {
  //     const rsp = response.data;
  //     res.render('index',{ rsp });
  //     })
  //     .catch((error) => {
  //     res.render('error',{ error });
  //     })
  //process the respond from the api, before sending to client
});

module.exports = router;
