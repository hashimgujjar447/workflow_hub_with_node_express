import dotenv from "dotenv";
dotenv.config();

import connectDb from "../config/db/connectDb";

import User from "../models/user.model";
import Workspace from "../models/workspace.model";
import WorkspaceMember from "../models/workspaceMember.model";
import Project from "../models/workspaceProject.model";
import ProjectMember from "../models/workspaceprojectMember.model";
import Task from "../models/workspaceProjectTask";
import TaskComment from "../models/workspaceProjectTaskComment";

const seed = async () => {
  try {
    await connectDb();

    console.log("✅ Database Connected");

    // =====================================================
    // CLEAN DATABASE
    // =====================================================

    await Promise.all([
      User.deleteMany({}),
      Workspace.deleteMany({}),
      WorkspaceMember.deleteMany({}),
      Project.deleteMany({}),
      ProjectMember.deleteMany({}),
      Task.deleteMany({}),
      TaskComment.deleteMany({}),
    ]);

    console.log("🗑️ Old data deleted");

    // =====================================================
    // USERS
    // =====================================================

    const users = await User.create([
      {
        first_name: "Hashim",
        last_name: "Gujjar",
        email: "hashim@test.com",
        password: "12345678",
      },

      {
        first_name: "Ali",
        last_name: "Khan",
        email: "ali@test.com",
        password: "12345678",
      },

      {
        first_name: "Ahmed",
        last_name: "Raza",
        email: "ahmed@test.com",
        password: "123456",
      },

      {
        first_name: "Usman",
        last_name: "Jutt",
        email: "usman@test.com",
        password: "123456",
      },

      {
        first_name: "Hamza",
        last_name: "Malik",
        email: "hamza@test.com",
        password: "123456",
      },
    ]);

    console.log("✅ Users created");

    // =====================================================
    // WORKSPACES
    // =====================================================

    const workspace1 = await Workspace.create({
      name: "WorkflowHub",
      description: "Main software agency workspace",
      owner: users[0]._id,
    });

    const workspace2 = await Workspace.create({
      name: "EcommercePro",
      description: "Ecommerce management workspace",
      owner: users[1]._id,
    });

    console.log("✅ Workspaces created");

    // =====================================================
    // WORKSPACE MEMBERS
    // =====================================================

    await WorkspaceMember.create([
      {
        workspace: workspace1._id,
        user: users[1]._id,
        role: "manager",
      },

      {
        workspace: workspace1._id,
        user: users[2]._id,
        role: "backend",
      },

      {
        workspace: workspace1._id,
        user: users[3]._id,
        role: "frontend",
      },

      {
        workspace: workspace1._id,
        user: users[4]._id,
        role: "seo",
      },

      {
        workspace: workspace2._id,
        user: users[0]._id,
        role: "manager",
      },

      {
        workspace: workspace2._id,
        user: users[2]._id,
        role: "frontend",
      },
    ]);

    console.log("✅ Workspace members added");

    // =====================================================
    // PROJECTS
    // =====================================================

    const backendProject = await Project.create({
      name: "Backend API",
      description: "Main backend system with JWT auth",
      workspace: workspace1._id,
      createdBy: users[0]._id,
    });

    const frontendProject = await Project.create({
      name: "Frontend Dashboard",
      description: "Admin dashboard frontend",
      workspace: workspace1._id,
      createdBy: users[1]._id,
    });

    const ecommerceProject = await Project.create({
      name: "Ecommerce Website",
      description: "Complete ecommerce platform",
      workspace: workspace2._id,
      createdBy: users[1]._id,
    });

    console.log("✅ Projects created");

    // =====================================================
    // PROJECT MEMBERS
    // =====================================================

    await ProjectMember.create([
      {
        project: backendProject._id,
        user: users[1]._id,
        role: "leader",
      },

      {
        project: backendProject._id,
        user: users[2]._id,
        role: "backend",
      },

      {
        project: frontendProject._id,
        user: users[3]._id,
        role: "frontend",
      },

      {
        project: frontendProject._id,
        user: users[4]._id,
        role: "designer",
      },

      {
        project: ecommerceProject._id,
        user: users[0]._id,
        role: "backend",
      },

      {
        project: ecommerceProject._id,
        user: users[2]._id,
        role: "frontend",
      },
    ]);

    console.log("✅ Project members added");

    // =====================================================
    // TASKS
    // =====================================================

    const task1 = await Task.create({
      title: "Setup JWT Authentication",
      description: "Implement login/register APIs with JWT",
      project: backendProject._id,
      createdBy: users[0]._id,
      assignedTo: users[2]._id,
      status: "in_progress",
    });

    const task2 = await Task.create({
      title: "Create User Profile API",
      description: "Build profile APIs with validation",
      project: backendProject._id,
      createdBy: users[1]._id,
      assignedTo: users[2]._id,
      status: "todo",
    });

    const task3 = await Task.create({
      title: "Build Sidebar UI",
      description: "Responsive sidebar using Tailwind",
      project: frontendProject._id,
      createdBy: users[1]._id,
      assignedTo: users[3]._id,
      status: "completed",
    });

    const task4 = await Task.create({
      title: "Design Landing Page",
      description: "Modern ecommerce landing page",
      project: ecommerceProject._id,
      createdBy: users[1]._id,
      assignedTo: users[4]._id,
      status: "in_progress",
    });

    const task5 = await Task.create({
      title: "Implement Product Filters",
      description: "Add category and price filters",
      project: ecommerceProject._id,
      createdBy: users[0]._id,
      assignedTo: users[2]._id,
      status: "todo",
    });

    console.log("✅ Tasks created");

    // =====================================================
    // COMMENTS
    // =====================================================

    const comment1 = await TaskComment.create({
      title: "JWT Progress Update",
      description: "Login API completed successfully",
      task: task1._id,
      user: users[2]._id,
    });

    const comment2 = await TaskComment.create({
      title: "Manager Feedback",
      description: "Great work keep improving 🔥",
      task: task1._id,
      user: users[1]._id,
      parentComment: comment1._id,
    });

    await TaskComment.create({
      title: "Sidebar Completed",
      description: "Sidebar UI completed and responsive",
      task: task3._id,
      user: users[3]._id,
    });

    await TaskComment.create({
      title: "Design Discussion",
      description: "Need final approval for hero section",
      task: task4._id,
      user: users[4]._id,
    });

    await TaskComment.create({
      title: "Backend Ready",
      description: "Filters API endpoints are ready",
      task: task5._id,
      user: users[0]._id,
    });

    console.log("✅ Comments created");

    // =====================================================
    // FINAL LOGS
    // =====================================================

    console.log("");
    console.log("====================================");
    console.log("🌱 DATABASE SEEDED SUCCESSFULLY");
    console.log("====================================");
    console.log("");

    console.log("👤 Users:", users.length);
    console.log("🏢 Workspaces: 2");
    console.log("📁 Projects: 3");
    console.log("✅ Tasks: 5");
    console.log("💬 Comments: 5");

    process.exit(0);
  } catch (error) {
    console.log("");
    console.log("❌ SEED FAILED");
    console.log(error);
    console.log("");

    process.exit(1);
  }
};

seed();
