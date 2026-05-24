import mongoose, { Schema, Document, Types } from "mongoose";

export const PROJECT_ROLES = [
  "leader",
  "frontend",
  "backend",
  "seo",
  "qa",
  "designer",
] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number];

export interface IProjectMember extends Document {
  user: Types.ObjectId;

  project: Types.ObjectId;

  role: ProjectRole;
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    role: {
      type: String,
      enum: PROJECT_ROLES,
      required: true,
      default: "frontend",
    },
  },
  {
    timestamps: true,
  },
);

// one user one project membership
projectMemberSchema.index({ user: 1, project: 1 }, { unique: true });

const ProjectMember = mongoose.model<IProjectMember>(
  "ProjectMember",
  projectMemberSchema,
);

export default ProjectMember;
