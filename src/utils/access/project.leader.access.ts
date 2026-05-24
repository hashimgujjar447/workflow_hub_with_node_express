import ProjectMember from "../../models/workspaceprojectMember.model";

import { checkProjectAccess } from "./project.access";

export const checkProjectLeaderAccess = async (
  userId: string,
  workspace_slug: string,
  project_slug: string,
) => {
  const { workspace, project, isProjectOwner } = await checkProjectAccess(
    userId,

    workspace_slug,

    project_slug,
  );

  const isLeader = await ProjectMember.findOne({
    project: project._id,

    user: userId,

    role: "leader",
  });

  if (!isLeader && !isProjectOwner) {
    throw new Error("You are not authorized");
  }

  return {
    workspace,

    project,

    isLeader,

    isProjectOwner,
  };
};
