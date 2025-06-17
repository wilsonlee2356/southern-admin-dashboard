import apiClient from "@/lib/api-client";
import axios, { AxiosResponse } from "axios";

/**
 * Invoice Service for managing invoice-related API calls
 */
export const loginService = async (username: string, password: string): Promise<boolean> => {
  try {
    // Make a POST request to the API endpoint for LDAP authentication
    // const response = await apiClient.post("/ldap/authenticate",
    //     {username : username, password: password},
    // );
    const response = await fetch(`http://localhost:8080/api/ldap/authenticate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username : username, password: password}),
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