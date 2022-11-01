const express = require("express");
const responseTime = require("response-time");
const axios = require("axios");
const app = express();
require("dotenv").config();
const AWS = require("aws-sdk");
const { route } = require(".");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const redis = require("redis");

const redisClient = redis.createClient({
  host: "cab432a2image.km2jzi.ng.0001.apse2.cache.amazonaws.com",
  port: "6379",
}); //cloud

// redisClient.connect();

redisClient.on("connect", function () {
  console.log("redis connected");
  console.log(`connected ${redisClient.connected}`);
});

//const redisClient = redis.createClient(); //Local
redisClient.on("error", (err) => {
  console.log("Error " + err);
});

const bucketName = "assignment4-images-store";
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
s3.createBucket({ Bucket: bucketName })
  .promise()
  .then(() => console.log(`Created bucket: ${bucketName}`))
  .catch((err) => {
    // Ignore 409 errors which indicate that the bucket already exists
    if (err.statusCode !== 409) {
      console.log(`Error creating bucket: ${err}`);
    }
  });
app.use(responseTime());
router.get("/", async (req, res, next) => {
  const image = req.query.name;

  console.log(image);
});

router.put("/store", async (req, res, next) => {
  // const hash = req.query.hash;
  const s3Key = req.query.hash;
  const redisKey = s3Key;
  const body1 = req.body;

  // redisClient.setEx(redisKey, 3600, JSON.stringify({ source: "Redis Cache" }));

  // return redisClient.get(redisKey, async (err, result) => {
  //   if (result) {
  //     // Serve from Cache
  //     // const resultJSON = JSON.parse(result);
  //     // console.log("Achieved from redis: ", key);
  //     // return res.status(200).json(resultJSON);
  //     console.log("あるよ");
  //   } else {
  //     console.log("ないよ");
  //   }
  // });

  console.log("555555");
  // console.log(req.fields);
  // console.log("files:", req.files);
  for (let item in req.files) {
    console.log(req.files[item].path);
    console.log(item);
  }
  // console.log(req.files.file.name);
  // console.log("66666666");
  let path1 = req.files["file0"].path;
  // let path2 = req.files.file.path;
  // console.log(path2);
  // const image1 = fs.readFileSync(path1, function (err, data) {
  //   fs.writeFileSync(image1, data);
  // });

  let storedata;

  // const image = sharp(path1);
  // image
  //   .toFile()
  //   .then((info) => {
  //     console.log(info);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  function f1() {
    return new Promise((resolve, reject) => {
      const image = sharp(path1);
      image
        .resize({
          width: 200,
          height: 100,
          fit: "contain",
          position: "left",
          background: "#ff0000",
        })
        // .blur(5)
        .toBuffer("image.png")
        .then((info) => {
          storedata = info;
          console.log(info);
        })
        .catch((error) => {
          console.log(error);
        });
      resolve("f1 ==> f2");
    });
  }
  function f2(passVal) {
    return new Promise((resolve, reject) => {
      //setTimeoutは動きをそれっぽくするために入れているだけなので削除可
      setTimeout(() => {
        //f1のresolve内の "f1 ==> f2" がpassValに代入される
        console.log("store: ", storedata);
        resolve("f2 ==> f3");
      }, Math.random() * 4000);
    });
  }
  function f3(passVal) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const objectParams = {
          Bucket: bucketName,
          Key: s3Key,
          Body: storedata,
        };
        s3.putObject(objectParams)
          .promise()
          .then(() => {
            console.log(`Successfully uploaded data to ${bucketName}/${s3Key}`);
          });
        console.log(passVal);
        console.log("#3: f3");
        resolve("f3 ==> f4");
      }, Math.random() * 3000);
    });
  }

  f1().then(f2).then(f3);

  // const objectParams = {
  //   Bucket: bucketName,
  //   Key: s3Key,
  //   Body: image1,
  // };
  // s3.putObject(objectParams)
  //   .promise()
  //   .then(() => {
  //     console.log(`Successfully uploaded data to ${bucketName}/${s3Key}`);
  //   });
  // console.log(image1);
  // if (req.method === "GET") {
  //   console.log("BBBBBBBBBBBBBBBb");
  //   res.writeHead(200, { "Content-Type": "text/html" });
  //   res.end(html);
  // } else if (req.method === "PUT") {
  //   const s3Key = `${hash}`;
  //   console.log("CCCCCC");
  //   const body = JSON.stringify({
  //     source: "S3 Bucket",
  //     body1,
  //   });
  //   const objectParams = {
  //     Bucket: bucketName,
  //     Key: s3Key,
  //     Body: body,
  //   };
  //   s3.putObject(objectParams)
  //     .promise()
  //     .then(() => {
  //       console.log(`Successfully uploaded data to ${bucketName}/${s3Key}`);
  //     });

  //   // if (Object.keys(req.body).length === 0) {
  //   //   console.log("空っぽだよーん");
  //   // }
  //   console.log("req.body: ", req.body.image);
  //   res.send("Received POST Data!");
  //   //ここにPOST受信処理を記述する
  // }
});

// console.log("---333---");
// console.log(req.files);
// console.log("---555---");

module.exports = router;
