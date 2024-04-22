import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //json response
  // res.status(200).json({
  //     message:"ok"
  // })

  //1.get user details from frontend
  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);

  //2.validation - not empty and other check
//   if (fullName === "") {
//     throw new ApiError(400, "Full name is required");
//   }
    if(
        [fullName,email,username,password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required");
    }
  //3.check if user already exists: username,email
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists");
    }
  //3.chcek for images and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("avatarLocalPath: ", avatarLocalPath);
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

  //4.upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   //5.as avatar is required so again check for avatar uploaded in cloudinary on not
    if(!avatar) {
        throw new ApiError(500,"Error in uploading avatar");
    }

  //6.create user object
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username :username.toLowerCase()
  })
  //create user object - create entry in db
  //7.chcek for user creation and remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
  }
  //return response
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )
});

export { registerUser };
