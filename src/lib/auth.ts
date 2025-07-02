"use client";

import { getSession, signOut, useSession } from "next-auth/react";

const getApiUrl = (endpoint: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined");
  }
  return `${baseURL}${endpoint}`;
};

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{
  accessToken: string | null;
  role?: string;
  username?: string;
}> {
  try {
    console.log(
      "Attempting to refresh access token with refreshToken:",
      refreshToken,
    );
    const response = await fetch(getApiUrl("/api/ldap/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    const data = await response.json();
    console.log("Refresh Response:", data, "Status:", response.status);

    if (!response.ok) {
      console.error("Refresh Failed:", data);
      throw new Error(data.message || "Failed to refresh token");
    }

    return {
      accessToken: data.accessToken,
      role: data.roles[0], // Include role if returned by backend
      username: data.username, // Include username if returned by backend
    };
  } catch (err) {
    console.error("Refresh Error:", err);
    return { accessToken: null };
  }
}

export function useAuthenticatedRequest() {
  const { update } = useSession();

  async function makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {},
  ): Promise<{
    response: Response | null;
    newAccessToken?: string;
  }> {
    const session = await getSession();
    if (!session?.accessToken) {
      console.error("No access token available");
      return { response: null };
    }

    try {
      console.log("Attempt to use access token ", session.accessToken);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
      });
      console.log(response);
      if (response.status === 401 && session.refreshToken) {
        console.log("Access token expired, attempting refresh");
        const newAccessToken = await refreshAccessToken(session.refreshToken);
        if (newAccessToken.accessToken) {
          console.log("New access token obtained:", newAccessToken);
          // await update({
          //   accessToken: newAccessToken.accessToken,
          //   role: newAccessToken.role,
          //   username: newAccessToken.username,
          // });
          await update({
            accessToken: newAccessToken.accessToken,
            role: newAccessToken.role,
            username: newAccessToken.username,
            refreshToken: session.refreshToken, // Preserve the refreshToken
          });
          console.log("Session updated with new access token");
          // Retry the original request
          const updatedResponse = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken.accessToken}`,
            },
            credentials: "include",
          });
          return { response: updatedResponse, newAccessToken: newAccessToken.accessToken };
        } else {
          console.error("Failed to refresh token, signing out");
          await signOut({ callbackUrl: "/auth/signin" });
          return { response: null };
        }
      }

      return { response };
    } catch (err) {
      console.error("Request Error:", err);
      return { response: null };
    }
  }

  return { makeAuthenticatedRequest };
}
