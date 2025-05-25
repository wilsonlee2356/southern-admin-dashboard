import axios from 'axios';
import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";
import { invoiceData, client, post, invoiceDataOutput, invoiceOutstandingSummary } from '@/types/ObjectTypes/InvoiceType';

const baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
// if (!baseURL) {
//   console.error(
//     "Error: NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined in environment variables",
//   );
// }
export const CombinedService = {
  

    async get_all_invoice(): Promise<invoiceData[]> {
      try{
        const response = await apiClient.get("/invoices");
        return response.data;
      } catch (error) {
        console.error('Error fetching all invoices:', error);
        throw error;
      }
    },

    async get_all_client(): Promise<client[]> {
      try{
        const response = await apiClient.get("/clients");
        return response.data;
      } catch (error) {
        console.error('Error fetching all invoices:', error);
        throw error;
      }
    },

    async get_all_post(): Promise<post[]> {
      try{
        const response = await apiClient.get("/posts");
        return response.data;
      } catch (error) {
        console.error('Error fetching all invoices:', error);
        throw error;
      }
    },

    async get_invoice_by_id(id: string): Promise<invoiceData> {
      try{
        const response = await fetch(`http://localhost:8080/api/invoices/num=${id}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        throw error;
      }
    },

    async get_invoice_outstanding_summary(): Promise<(string | number)[][]> {
      try{
        const response = await fetch(`http://localhost:8080/api/invoices/invoiceSum`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        throw error;
      }
    },

    async get_post_client_invoice_summry(): Promise<(string | number)[][]> {
      try{
        const response = await fetch(`http://localhost:8080/api/posts/PostAndClientWithInvoiceSum`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching invoice by ID:', error);
        throw error;
      }
    },

    async update_invoice_by_id(id: number, updateData: invoiceData): Promise<invoiceData> {
      try{
        const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating invoice:', error);
        throw error;
      }
    },

    async set_post_to_finish(ids: string): Promise<post[]> {
      try{
        const response = await fetch(`http://localhost:8080/api/posts/setEnded/${ids}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: null,
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating invoice:', error);
        throw error;
      }
    },

    async delete_invoice_by_id(id: number) {
      try{
        const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
          method: 'DELETE',
        });
        // const data = await response.json();
        // return data;
      } catch (error) {
        console.error('Error deleting invoice:', error);
        throw error;
      }
    },


    async create_invoice(newInvoice: invoiceDataOutput): Promise<invoiceData> {
      try{
        const response = await fetch(`http://localhost:8080/api/combined`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newInvoice),
        });
        const data = await response.json();
        return data;
      }
      catch (error) {
        console.error('Error creating invoice:', error);
        throw error;
      }
    },

    async update_invoice_details(id: number, updateData: invoiceData): Promise<invoiceData> {
      try{
        const response = await fetch(`http://localhost:8080/api/combined/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      return data;
      } catch (error) {
        console.error('Error updating invoice details:', error);
        throw error;
      }
      
    },
}
// export async function GET_ALL_INVOICES(): Promise<invoiceData[]> {
//   const response = await fetch('http://localhost:8080/api/invoices');
//   const data = await response.json();
//   return data;
// }

// export async function GET_INVOICE_BY_ID(id: string): Promise<invoiceData> {
//   const response = await fetch(`http://localhost:8080/api/invoices/num=${id}`);
//   const data = await response.json();
//   return data;
// }

// export async function UPDATE_INVOICE_BY_ID(id: number, updateData: invoiceData): Promise<invoiceData> {

//   const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updateData),
//   });
//   const data = await response.json();
//   return data;
// }

// export async function DELETE_INVOICE_BY_ID(id: number): Promise<invoiceData> {
//   const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
//     method: 'DELETE',
//   });
//   const data = await response.json();
//   return data;
// }


// export async function CREATE_INVOICE(newInvoice: invoiceDataOutput): Promise<invoiceData> {
//   const response = await fetch(`http://localhost:8080/api/combined`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(newInvoice),
//   });
//   const data = await response.json();
//   return data;
// }

// export async function UPDATE_INVOICE_DETAILS(id: number, updateData: invoiceData): Promise<invoiceData> {
//   const response = await fetch(`http://localhost:8080/api/combined/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(updateData),
//   });
//   const data = await response.json();
//   return data;
// }