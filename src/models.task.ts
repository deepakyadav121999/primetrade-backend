import mongoose, { Document, Schema } from "mongoose";
import type { IUser } from "./models.user";

export interface ITask extends Document {
  user: IUser["_id"];
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "done";
}

const taskSchema = new Schema<ITask>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1, createdAt: -1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
