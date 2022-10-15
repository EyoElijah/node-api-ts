import { Schema, model } from 'mongoose';
import Post from '../post/post.interface';

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Post>('Post', PostSchema);
