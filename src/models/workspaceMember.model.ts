import mongoose, {
  Schema,
  Document,
  Types,
} from "mongoose";


export const WORKSPACE_ROLES = [
  "manager",
  "leader",
  "frontend",
  "backend",
  "seo",
] as const;


export type WorkspaceRole =
  (typeof WORKSPACE_ROLES)[number];


interface IWorkspaceMember extends Document {
  user: Types.ObjectId;
  workspace: Types.ObjectId;
  role: WorkspaceRole;
}


const workspaceMemberSchema =
  new Schema<IWorkspaceMember>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      workspace: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
        required: true,
      },

      role: {
        type: String,
        enum: WORKSPACE_ROLES,
        default: "frontend",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );


// one user one workspace membership
workspaceMemberSchema.index(
  { user: 1, workspace: 1 },
  { unique: true }
);


const WorkspaceMember =
  mongoose.model<IWorkspaceMember>(
    "WorkspaceMember",
    workspaceMemberSchema
  );

export default WorkspaceMember;