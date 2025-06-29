"use client";
import React, { useEffect, useState } from "react";
import { UserService } from "../api/userService";
import { useAuthenticatedRequest } from "@/lib/auth";
import { user, userCreateType } from "@/types/ObjectTypes/UserType";

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
  //const [posts, setPosts] = useState(initialPosts);
  const [users, setUsers] = useState<user[]>([]);
  const [userRole, setUserRole] = useState("admin"); // Can be "public", "team", or "admin"
  const [newUser, setNewUser] = useState<userCreateType>({
    username: "",
    sn: "",
    cn: "",
    role: "observers",
    password: "",
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
  // const filteredPosts = posts.filter((post) => {
  //   if (userRole === "admin") return true;
  //   if (userRole === "team") return post.access !== "admin";
  //   return post.access === "public";
  // });

  // Handle post creation
  const handleCreatePost = (e: any) => {
    e.preventDefault();
    console.log("New user: ",newUser);
    //do sth here
    //???????????

    UserService.add_users(makeAuthenticatedRequest, newUser).then((data)=> {
      if(data.username){
        const newUserCreated : user = {
          uid: data.username,
          sn: data.sn,
          cn: data.cn,
          roles: [data.role]
        }
        setUsers([...users, newUserCreated]);
        setNewUser({
          username: "",
          sn: "",
          cn: "",
          role: "observers",
          password: "",
        });
        console.log("Users: ", users);
      }
    })
    // const post = {
    //   username: "",
    //   sn: "",
    //   cn: "",
    //   access: "Observer",
    //   password: "",
    // };
    //setPosts([...posts, post]);
    //setNewUser({ title: "", status: "Draft", access: "public" });
  };

  // Handle post deletion
  const handleDeletePost = (username: string) => {
    // if (userRole !== "admin") {
    //   alert("Only admins can delete posts");
    //   return;
    // }
    UserService.remove_users(makeAuthenticatedRequest, username).then((res)=> {
        console.log("Users: ", users);
    })
    //setPosts(posts.filter((post) => post.id !== id));
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
          <div className="flex flex-row gap-4">
            <input
              type="text"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              placeholder="Username"
              className="w-1/2 rounded border p-2"
              required
            />
            <input
              type="text"
              value={newUser.cn}
              onChange={(e) =>
                setNewUser({ ...newUser, cn: e.target.value })
              }
              placeholder="Full name"
              className="w-1/2 rounded border p-2"
              required
            />
          </div>
          <div className="flex flex-row gap-4">
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Password"
              className="w-1/2 rounded border p-2"
              required
            />
            <input
              type="text"
              value={newUser.sn}
              onChange={(e) =>
                setNewUser({ ...newUser, sn: e.target.value })
              }
              placeholder="Surname"
              className="w-1/2 rounded border p-2"
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
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
              className="rounded border p-2"
              disabled={userRole !== "admin"}
            >
              <option value="observers">Observer</option>
              <option value="editors">Editor</option>
              <option value="admins">Admin</option>
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
                     handleDeletePost(user.uid)

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
