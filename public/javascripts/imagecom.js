const form = document.getElementById("form");
var file = document.getElementById("image");
// const sharp = require("sharp");

var fileData = new FileReader();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  var originalImage = document.getElementById("image").files[0];
  console.log(file.files.length);
  const formData = new FormData();
  for (let i = 0; i < file.files.length; i++) {
    formData.append("file" + i, file.files[i]);
    console.log(file.files[i]);
  }
  console.log(formData.get("file0"));

  var hash;

  fileData.onload = async () => {
    console.log(fileData);
    hash = await MD5.generate(fileData.result).toString();
    console.log(originalImage);
    // const promise = sharp(fileData.result);
    // document.getElementById("preview").innerHTML +=
    //   '<img src="' + fileData.result + '">';

    // try {
    //   const response = await fetch(
    //     `/s3?name=${originalImage.name}&hash=${hash}`
    //   );
    // } catch (err) {
    //   console.log(err);
    // }
    fetch(`/s3/store?hash=${hash}`, {
      method: "put",
      // headers: {
      //   "Content-Type": originalImage.type,
      // },
      body: formData,
    }).catch(console.error);
  };
  fileData.readAsDataURL(originalImage);
});

// const btn = document.getElementById("btn");

// btn.addEventListener(
//   "click",
//   () => {
//     console.log(fileData);
//     let element = document.createElement(a);
//     element.href = fileData.result;
//     element.download = "AAA.png";
//     element = "_blank";
//     element.click();
//   },
//   false
// );
const btn = document.querySelector(".bn");

btn.addEventListener(
  "click",
  () => {
    if (fileData.result != null) {
      let file = fileData.result.replace(/^data:\w+\/\w+;base64,/, "");
      const fileExtension = fileData.result
        .toString()
        .slice(fileData.result.indexOf("/") + 1, fileData.result.indexOf(";"));
      const contentType = fileData.result
        .toString()
        .slice(fileData.result.indexOf(":") + 1, fileData.result.indexOf(";"));
      console.log(file);
      console.log(fileExtension);

      //a要素を生成
      let element = document.createElement("a");
      //a要素のhref属性を設定
      element.href = fileData.result;
      //a要素のdownload属性を設定
      element.download = "sample.png";
      //a要素のtarget属性を設定
      element.target = "_blank";
      //a要素のクリック実行
      element.click();
    } else {
      console.log("Put image");
    }
  },
  false
);

//if redis => true(there is data), s3=>get data
//if redis => false, create tranform image
