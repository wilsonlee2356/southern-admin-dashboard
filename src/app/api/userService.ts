import axios from 'axios';
import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";
import { user, userCreateType } from '@/types/ObjectTypes/UserType';

// if (!baseURL) {
//   console.error(
//     "Error: NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined in environment variables",
//   );
// }
const getApiUrl = (endpoint: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined");
  }
  return `${baseURL}${endpoint}`;
};

export const UserService = {
  
    async get_all_users(makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<{ response: Response | null; newAccessToken?: string }>): Promise<user[]> {
      try{
        const { response } = await makeAuthenticatedRequest(getApiUrl('/api/ldap/users'), {
          method: 'GET',
        });

        if(response && response.ok){
          return response.json();
        } 
        console.log("Unable to fetch all users possibly due to invaild token");
        throw new Error("Unable to fetch all users possibly due to invaild token");

        // const response = await apiClient.get("/invoiceCheques");
        // return response.data;
      } catch (error) {
        console.error('Error fetching all user:', error);
        throw error;
      }
    },

    async add_users(makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<{ response: Response | null; newAccessToken?: string }>, userToBeAdded: userCreateType): Promise<userCreateType> {
      try{
        const { response } = await makeAuthenticatedRequest(getApiUrl('/api/ldap/users'), {
          method: 'POST',
          body: JSON.stringify(userToBeAdded),
        });

        if(response && response.ok){
          return response.json();
        } 
        console.log("Unable to add users possibly due to invaild token");
        throw new Error("Unable to add users possibly due to invaild token");

        // const response = await apiClient.get("/invoiceCheques");
        // return response.data;
      } catch (error) {
        console.error('Error adding user:', error);
        throw error;
      }
    },

    async remove_users(makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<{ response: Response | null; newAccessToken?: string }>, username: string) {
      try{
        const { response } = await makeAuthenticatedRequest(getApiUrl(`/api/ldap/users/${username}`), {
          method: 'DELETE',
        });

        if(response && response.ok){
          return response.json();
        } 
        console.log("Unable to delete users possibly due to invaild token");
        throw new Error("Unable to delete users possibly due to invaild token");

        // const response = await apiClient.get("/invoiceCheques");
        // return response.data;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
      }
    },
}