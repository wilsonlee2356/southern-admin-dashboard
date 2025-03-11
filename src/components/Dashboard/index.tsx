"use client";
import { useAuth } from "@/contexts/authContext";
import React from "react";

function index() {
  const { currentUser } = useAuth();
  return <div>index</div>;
}

export default index;
