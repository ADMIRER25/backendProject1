import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewires/multer.middleware.js";

const router = Router();

router.route("/register").post(
    //middleware
    upload.fields([
        {
            //should be same name field in frontend
            name : "avatar",
            maxCount: 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    //controller
    registerUser)

export default router;