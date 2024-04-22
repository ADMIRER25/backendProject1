import multer from "multer";

const storage = multer.diskStorage({
  //req holds the json data came into body or request came from the user , multer has the file ,file got the files
  destination: function(req, file, cb){
    //cb:callback
    cb(null, "./public/temp");
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
