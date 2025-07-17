"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { PostClientContentProvider } from "@/utils/post-client-content";
import { SessionProvider } from "next-auth/react";
import { AlertProvider } from "@/utils/AlertProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <AlertProvider>
        <SessionProvider>
          <SidebarProvider>
            <PostClientContentProvider>{children}</PostClientContentProvider>
          </SidebarProvider>
        </SessionProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
