"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { PostClientContentProvider } from "@/utils/post-client-content";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SessionProvider>
        <SidebarProvider>
          <PostClientContentProvider>{children}</PostClientContentProvider>
        </SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
