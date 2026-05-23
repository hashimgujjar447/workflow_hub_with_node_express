import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";
import slugify from "slugify"

export interface ITaskComment
  extends Document {

  title: string;

  slug: string;

  description?: string;

  user: Types.ObjectId;

  task: Types.ObjectId;

  parentComment?: Types.ObjectId | null;
}


const taskCommentSchema =
  new Schema<ITaskComment>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      description: {
        type: String,
        default: "",
      },

      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      task: {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true,
      },

      parentComment: {
        type: Schema.Types.ObjectId,
        ref: "TaskComment",
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

taskCommentSchema.pre("save", async function () {

  if (this.isModified("title")) {

    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;

    let counter = 1;

    while (
      await mongoose.models.TaskComment.exists({
        _id: { $ne: this._id },
        slug,
        task: this.task,
      })
    ) {

      slug = `${baseSlug}-${counter}`;

      counter++;
    }

    this.slug = slug;
  }

});


// unique slug per task
taskCommentSchema.index(
  { task: 1, slug: 1 },
  { unique: true }
);


const TaskComment =
  mongoose.model<ITaskComment>(
    "TaskComment",
    taskCommentSchema
  );

export default TaskComment;