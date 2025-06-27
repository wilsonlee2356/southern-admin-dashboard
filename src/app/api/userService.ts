import axios from 'axios';
import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";
import { user, userCreateType } from '@/types/ObjectTypes/UserType';

// if (!baseURL) {
//   console.error(
//     "Error: NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined in environment variables",
//   );
// }


export const UserService = {
  
    async get_all_users(makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<{ response: Response | null; newAccessToken?: string }>): Promise<user[]> {
      try{
        const { response } = await makeAuthenticatedRequest('http://localhost:8080/api/ldap/users', {
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
        console.error('Error fetching all invoiceCheques:', error);
        throw error;
      }
    },

    async add_users(makeAuthenticatedRequest: (url: string, options?: RequestInit) => Promise<{ response: Response | null; newAccessToken?: string }>, userToBeAdded: userCreateType): Promise<userCreateType> {
      try{
        const { response } = await makeAuthenticatedRequest('http://localhost:8080/api/ldap/users', {
          method: 'POST',
          body: JSON.stringify(userToBeAdded),
        });

        if(response && response.ok){
          return response.json();
        } 
        console.log("Unable to fetch all users possibly due to invaild token");
        throw new Error("Unable to fetch all users possibly due to invaild token");

        // const response = await apiClient.get("/invoiceCheques");
        // return response.data;
      } catch (error) {
        console.error('Error fetching all invoiceCheques:', error);
        throw error;
      }
    },
}