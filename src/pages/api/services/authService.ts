import apiClient from "@/lib/api-client";
import axios, { AxiosResponse } from "axios";

type csrfTokenResponse = {
    token: string;
};
/**
 * Invoice Service for managing invoice-related API calls
 */
export const loginService = async (username: string, password: string, token: string): Promise<boolean> => {
  try {
    // Make a POST request to the API endpoint for LDAP authentication
    // const response = await apiClient.post("/ldap/authenticate",
    //     {username : username, password: password},
    // );
    const response = await fetch(`http://localhost:8080/api/ldap/authenticate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-Token': token, // Include CSRF token in the headers
          },
          body: new URLSearchParams({
            username,
            password,
          }).toString(),
          credentials: 'include',
        });
    console.log("Login response: ", response);
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login failed: ", error);
    return false;
  }
};

export const logoutService = async (token: string): Promise<boolean> => {
  try {
    // Make a POST request to the API endpoint for LDAP authentication
    // const response = await apiClient.post("/ldap/authenticate",
    //     {username : username, password: password},
    // );
    const response = await fetch(`http://localhost:8080/api/logout`, {
          method: 'POST',
          headers: {
            'X-CSRF-Token': token, // Include CSRF token in the headers
          },
          credentials: 'include',
        });
    console.log("Logout response: ", response);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Logout failed: ", error);
    return false;
  }
};

export const csrfTokenService = async (): Promise<string> => {
  try {
    // Make a GET request to the API endpoint for CSRF token
    const response: AxiosResponse<csrfTokenResponse> = await apiClient.get("/csrf");
    // console.log("CSRF Token response: ", response);
    return response.data.token;
  } catch (error) {
    console.error("Failed to fetch CSRF token: ", error);
    throw error;
  }
};