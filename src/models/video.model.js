import { Schema } from "mongoose";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true,
    },

    thumbnail: {
      type: String, // cloudinary url
      required: true,
    },

    title: { type: String, required: true },

    description: { type: String, required: true },

    duration: {
      type: Number, // number is used for view duration that will be taken from cloudinary.
      required: true,
    },

    views: { type: Number, default: 0 },

    isPublished: {
      type: Boolean,
      default: true,
    },
    // stores the owner or uploader details
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate); //plugin is a hook

export const Video = mongoose.model("Video", videoSchema);
