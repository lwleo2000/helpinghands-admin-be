const util = require("util");
const fs = require("fs");
const aws = require("aws-sdk");
const { nanoid } = require("nanoid");
const OS = require("os");
const sharp = require("sharp");
module.exports.ResizeImage = async (
  imageList = [
    {
      uid: "uid",
      path: "path",
      name: "name",
    },
  ],
  option = {
    autoEXIFRotate: true,
    size: {
      width: Number,
      height: Number,
    },
  }
) => {
  //   console.log(imageList);
  const done = [
    /* {
          url:"",
          name:"",
          uid:"",
          status:"done/fail/pending",
          Key:""
      } */
  ];
  const image = imageList;
  const processedImg = await resize(image.path, option);
  done.push({
    url: "",
    name: processedImg.name,
    uid: processedImg.uid,
    Key: processedImg.Key,
    path: processedImg.path,
  });

  return done;
};

const resize = async (image_path, option) => {
  const filename = nanoid() + ".jpeg";
  console.log(image_path, 111);
  return sharp(image_path)
    .rotate()
    .resize({
      width: option.size.width,
      height: option.size.height,
      fit: "cover",
    })
    .flatten({ background: "#f7f7f7" })
    .toFile(OS.tmpdir() + "/" + filename)
    .then((result) => {
      result.name = filename;
      result.uid = filename;
      result.Key = filename;
      result.path = OS.tmpdir() + "/" + filename;
      return result;
    });
};

module.exports.UploadFile = async (fileList, isPublic) => {
  var uploadComplete = [];
  const image = fileList[0];
  const path = image.path;
  console.log(path, 1);
  const filename = await generateNewFileName(path);
  uploadComplete.push(...(await Uploader(filename, path, isPublic)));

  return uploadComplete;
};

const generateNewFileName = async (filepath) => {
  var fileType = filepath.substring(filepath.indexOf(".") + 1, filepath.length);
  const filename = nanoid() + "." + fileType;
  return filename;
};

const Uploader = async (filename, filepath, isPublic) => {
  var image_url = [];
  //Convert to binary
  const read_file = util.promisify(fs.readFile);
  var file = await read_file(filepath);

  var param = {
    Key: filename,
    Body: file,
    Bucket: "helpinghands-bucket-2000",
  };

  var Uploading = await new aws.S3({
    accessKeyId: process.env.AWS_S3_ACCESSKEYID,
    secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY,
    sslEnabled: true,
  })
    .putObject(param)
    .promise();

  //console.log(Uploading);
  if (Uploading) {
    image_url.push({
      url:
        "https://" +
        "helpinghands-bucket-2000" +
        ".s3-ap-southeast-1.amazonaws.com/" +
        filename,
      name: filename,
      uid: filename,
      status: "done",
      Key: filename,
      isPublic: isPublic,
    });
  }

  return image_url;
};
