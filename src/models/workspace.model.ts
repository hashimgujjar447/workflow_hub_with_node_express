import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";

import slugify from "slugify";


export interface IWorkspace extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;

  owner: Types.ObjectId;
}


const workspaceSchema =
  new Schema<IWorkspace>(
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

      icon: {
        type: String,
        default: "",
      },

      owner: {
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
workspaceSchema.pre("save", async function () {

  if (this.isModified("name")) {

    const baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    let slug = baseSlug;

    let counter = 1;

    while (
      await mongoose.models.Workspace.exists({
        _id: { $ne: this._id },
        owner: this.owner,
        slug,
      })
    ) {

      slug = `${baseSlug}-${counter}`;

      counter++;
    }

    this.slug = slug;
  }

});



workspaceSchema.index(
  { owner: 1, name: 1 },
  { unique: true }
);



workspaceSchema.index(
  { owner: 1, slug: 1 },
  { unique: true }
);


const Workspace = mongoose.model<IWorkspace>(
  "Workspace",
  workspaceSchema
);

export default Workspace;