import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

//? we would be building logic in controllers and write steps that we will be following.

// 1. get user details from frontend
// 2. vailidation - are field not empty or not
// 3. check if user already exsist or not
// 4. check if images or avatar is uploaded or not
// 5. upload all files to cloudinary
// 6. create user object - that will be send in database.
// 7. when we will get the response we need to remove the password and refersh token field .
// 8. check for user creation
// 9. return correct response.

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "ok",
  // });

  //todo getting user details
  const { username, email, password, fullname } = req.body;
  //console.log("email:", email);  just for checking with postman.

  // we can check individually like
  // if(username === ""){throw new ApiError (400, "write username")}
  // better way is to club all.
  //! ?. optional chaining it help in avoiding error if field is undefined or null and return the value if it is present.

  // todo checking if field is empty or not
  if (
    [username, email, password, fullname].some((field) => {
      field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All field are required");
  }

  //todo check if user exsist or not.

  const exsistedUser = await User.findOne({
    $or: [{ username }, { email }], //! $or is a operator in mongodb and find and findone is also method
  });

  if (exsistedUser) {
    throw new ApiError(409, "User already exsist.");
  }

  //todo if image or avatar is uploaded or not

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, " Avatar is required");
  }

  // TODO upload on cloudinary

  const avatar = await uploadOnClodinary(avatarLocalPath);
  const coverImage = await uploadOnClodinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(402, "avatar file is required");
  }

  // todo upload on database
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username,
    password,
  });

  // todo check if user is empty
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //! when mongodb save object it creates an id and we are searching element by id.
  //! "-password -refreshToken" is used to exclude them

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while creating user.");
  }

  // todo to return response.

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
