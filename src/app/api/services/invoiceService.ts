import apiClient from "@/lib/api-client";
import { AxiosResponse } from "axios";
import { InvoiceData } from "@/types/invoice";
/**
 * Invoice Service for managing invoice-related API calls
 */
export const InvoiceService = {
  
  /**
   * Retrieves all invoices
   * @returns Promise resolving to an array of InvoiceData
   * @throws Error if the request fails
   */
  // async getAll(): Promise<any[]> {
  //   try {
  //     const response: AxiosResponse<any[]> = await apiClient.get("/invoices");
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Unable to retrieve invoices");
  //   }
  // },

  // /**
  //  * Retrieves all invoices
  //  * @returns Promise resolving to an array of InvoiceData
  //  * @throws Error if the request fails
  //  */
  // async getAllSortByDate(): Promise<any[]> {
  //   try {
  //     const response: AxiosResponse<any[]> = await apiClient.get("/invoices/sorted");
  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error("Unable to retrieve invoices");
  //   }
  // },

  // /**
  //  * Retrieves a single invoice by ID
  //  * @param id - The invoice ID
  //  * @returns Promise resolving to InvoiceData
  //  * @throws Error if the request fails
  //  */
  // async getById(id: string): Promise<InvoiceData> {
  //   try {
  //     const response: AxiosResponse<InvoiceData> = await apiClient.get(
  //       `/invoices/num/${id}`,
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(`Unable to retrieve invoice ${id}`);
  //   }
  // },

  // /**
  //  * Creates a new invoice
  //  * @param invoice - The invoice data to create
  //  * @returns Promise resolving to the created InvoiceData
  //  * @throws Error if the request fails
  //  */
  // async create(invoice: Omit<InvoiceData, "id">): Promise<InvoiceData> {
  //   try {
  //     const response: AxiosResponse<InvoiceData> = await apiClient.post(
  //       "/invoices",
  //       invoice,
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error("Unable to create invoice");
  //   }
  // },
};
