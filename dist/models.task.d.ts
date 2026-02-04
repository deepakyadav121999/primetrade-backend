import mongoose, { Document } from "mongoose";
import type { IUser } from "./models.user";
export interface ITask extends Document {
    user: IUser["_id"];
    title: string;
    description?: string;
    status: "pending" | "in-progress" | "done";
}
export declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, mongoose.DefaultSchemaOptions> & ITask & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITask>;
//# sourceMappingURL=models.task.d.ts.map