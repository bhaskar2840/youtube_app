import { Schema } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { jwt } from "jsonwebtoken"; // it is a bearer token (ek chabi ki tarah hai)
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true, // if you want to make any code searchable give index can easliy track it
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //! uses cloudinary url , as storing image is hard
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }], //! Array of watched videos
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// pre( ) is a hook that will do things before saving data.

//!donot use arrow func for callback here as this will not have reference for the userSchema it does not contain this

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // isModified is used to check if anything is modified.so it is a precheck to insure that we only change password when we need it not everytime.
  }

  this.password = bcrypt.hash(this.password, 10); // 10 is salting

  next(); // middleware therefor need to close it.
});

//todo we need to check is password correct or not
//methods can be predefined or custom we create custom
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // this will retur ture or false
};

//todo we need to check for tokens

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      //payload
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//todo refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      //payload
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,

    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
