"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { AuthProvider } from "@/contexts/authContext";
import { ThemeProvider } from "next-themes";
import { PostClientContentProvider } from "@/utils/post-client-content";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SidebarProvider>
        <AuthProvider>
            <PostClientContentProvider>
              {children}
            </PostClientContentProvider>
          </AuthProvider>
        </SidebarProvider>
    </ThemeProvider>
  );
}
