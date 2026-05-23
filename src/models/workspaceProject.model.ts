import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

import slugify from "slugify";


export interface IProject extends Document {
  name: string;
  slug: string;
  description?: string;

  workspace: Types.ObjectId;

  createdBy: Types.ObjectId;
}


const projectSchema =
  new Schema<IProject>(
    {
      name: {
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

      workspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );


// 🔥 AUTO GENERATE UNIQUE SLUG
projectSchema.pre("save", async function () {

  if (this.isModified("name")) {

    const baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;

    let counter = 1;

    while (
      await mongoose.models.Project.exists({
        _id: { $ne: this._id },
        workspace: this.workspace,
        slug,
      })
    ) {

      slug = `${baseSlug}-${counter}`;

      counter++;
    }

    this.slug = slug;
  }

});


// 🔥 UNIQUE PROJECT NAME PER WORKSPACE
projectSchema.index(
  { workspace: 1, name: 1 },
  { unique: true }
);


// 🔥 UNIQUE SLUG PER WORKSPACE
projectSchema.index(
  { workspace: 1, slug: 1 },
  { unique: true }
);


const Project = mongoose.model<IProject>(
  "Project",
  projectSchema
);

export default Project;