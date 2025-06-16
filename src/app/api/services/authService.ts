import apiClient from "@/lib/api-client";
import axios, { AxiosResponse } from "axios";

/**
 * Invoice Service for managing invoice-related API calls
 */
export const loginService = async (username: string, password: string): Promise<boolean> => {
  try {
    // Send a GET request to the backend's root endpoint with Basic Auth
    const response = await axios.get(`http://localhost:8080/api/`, {
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`, // Encode username and password in Base64
      },
    });

    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login failed: ", error);
    return false;
  }
};