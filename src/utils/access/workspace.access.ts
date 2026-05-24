import Workspace from "../../models/workspace.model";

import WorkspaceMember from "../../models/workspaceMember.model";

export const checkWorkspaceAccess = async (
  userId: string,
  workspace_slug: string,
) => {
  const workspace = await Workspace.findOne({
    slug: workspace_slug,
  }).populate("owner", "first_name last_name email");

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isMember = await WorkspaceMember.findOne({
    workspace: workspace._id,

    user: userId,
  });

  const isOwner = workspace.owner._id.toString() === userId;

  if (!isMember && !isOwner) {
    throw new Error("You are not member of workspace");
  }

  return {
    workspace,
    isOwner,
    isMember,
  };
};
