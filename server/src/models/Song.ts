import mongoose, { Document, Schema } from "mongoose";

export interface ISong extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

const SongSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
  },
  { timestamps: true } 
);

export default mongoose.model<ISong>("Song", SongSchema);
