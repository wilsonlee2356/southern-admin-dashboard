"use client";
import { useAuth } from "@/contexts/authContext";
import React from "react";

function Dashboard() {
  const { currentUser } = useAuth();
  return <div>index</div>;
}

export default Dashboard;
