import mongoose, { Schema, Document, Types } from "mongoose";

import slugify from "slugify";

export const TASK_STATUS = [
  "todo",
  "in_progress",
  "completed",
  "failed",
] as const;

export type TaskStatus = (typeof TASK_STATUS)[number];

export interface ITask extends Document {
  title: string;

  slug: string;

  description?: string;

  status: TaskStatus;

  project: Types.ObjectId;

  createdBy: Types.ObjectId;

  assignedTo?: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,

      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: TASK_STATUS,
      default: "todo",
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 AUTO GENERATE UNIQUE SLUG
taskSchema.pre("save", async function () {
  if (this.isModified("title")) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;

    let counter = 1;

    while (
      await mongoose.models.Task.exists({
        _id: { $ne: this._id },
        project: this.project,
        slug,
      })
    ) {
      slug = `${baseSlug}-${counter}`;

      counter++;
    }

    this.slug = slug;
  }
});

taskSchema.index({ project: 1, title: 1 }, { unique: true });

taskSchema.index({ project: 1, slug: 1 }, { unique: true });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
