"use client";
import React, { useEffect, useState } from "react";
import { UserService } from "../api/userService";
import { useAuthenticatedRequest } from "@/lib/auth";
import { user } from "@/types/ObjectTypes/UserType";

// Mock data for demonstration
const initialPosts = [
  {
    id: 1,
    title: "First Post",
    author: "John",
    status: "Published",
    access: "public",
  },
  {
    id: 2,
    title: "Team Update",
    author: "Jane",
    status: "Draft",
    access: "team",
  },
  {
    id: 3,
    title: "Admin Notice",
    author: "Admin",
    status: "Published",
    access: "admin",
  },
];

function PostManagementPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [users, setUsers] = useState<user[]>([]);
  const [userRole, setUserRole] = useState("admin"); // Can be "public", "team", or "admin"
  const [newPost, setNewPost] = useState({
    title: "",
    status: "Draft",
    access: "public",
  });

  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const response : user[] = await UserService.get_all_users(makeAuthenticatedRequest);
      setUsers(response);
      console.log("All user: ", response);
    };
    fetchUsers();
  }, []);

  // Filter posts based on user role
  const filteredPosts = posts.filter((post) => {
    if (userRole === "admin") return true;
    if (userRole === "team") return post.access !== "admin";
    return post.access === "public";
  });

  // Handle post creation
  const handleCreatePost = (e: any) => {
    e.preventDefault();
    const post = {
      id: posts.length + 1,
      title: newPost.title,
      author: "Current User", // In real app, get from auth
      status: newPost.status,
      access: newPost.access,
    };
    setPosts([...posts, post]);
    setNewPost({ title: "", status: "Draft", access: "public" });
  };

  // Handle post deletion
  const handleDeletePost = (id: any) => {
    if (userRole !== "admin") {
      alert("Only admins can delete posts");
      return;
    }
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Role Switcher - For Demo Purposes */}
      {/* <div className="mb-6">
        <h2 className="mb-2 text-xl font-bold">Switch Role:</h2>
        <div className="flex gap-4">
          {["public", "team", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`rounded px-4 py-2 ${
                userRole === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        <p className="mt-2">Current Role: {userRole}</p>
      </div> */}

      {/* Create Post Form */}
      <div className="mb-8 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-4 text-xl font-bold">Create New User</h2>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              placeholder="Username"
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              placeholder="Password"
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div className="flex gap-4">
            {/* <select
              value={newPost.status}
              onChange={(e) =>
                setNewPost({ ...newPost, status: e.target.value })
              }
              className="rounded border p-2"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select> */}
            <select
              value={newPost.access}
              onChange={(e) =>
                setNewPost({ ...newPost, access: e.target.value })
              }
              className="rounded border p-2"
              disabled={userRole !== "admin"}
            >
              <option value="public">Public</option>
              <option value="team">Team</option>
              <option value="admin">Admin Only</option>
            </select>
            <button
              type="submit"
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div>
        <h2 className="mb-4 text-xl font-bold">
          User ({users.length})
        </h2>
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.uid}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <h3 className="font-semibold">{user.uid}</h3>
                <p className="text-sm text-gray-600">
                  SN: {user.sn} | CN: {user.cn} | Access: {user.roles[0]}
                </p>
              </div>
              {userRole === "admin" && (
                <button
                  onClick={() => {
                    // handleDeletePost(post.id)
                  }}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostManagementPage;
