import {
  invoiceData,
  client,
  post,
  cheque,
  invoiceCheques,
  invoiceDataOutput,
  postClientInvoiceSummary,
  chartData,
} from "@/types/ObjectTypes/InvoiceType";

// Define the type for makeAuthenticatedRequest
interface AuthRequestHandler {
  (
    url: string,
    options?: RequestInit,
  ): Promise<{ response: Response | null; newAccessToken?: string }>;
}

// Helper function to construct API URLs
const getApiUrl = (endpoint: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_BASE_URL is not defined");
  }
  return `${baseURL}${endpoint}`;
};

// Centralized API request handler with timeout and improved error handling
async function makeApiRequest<T>(
  endpoint: string,
  options: RequestInit,
  makeAuthenticatedRequest: AuthRequestHandler,
  errorMessage: string,
): Promise<T> {
  const controller = new AbortController();
  // const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    console.log("Making request to:", getApiUrl(endpoint), "with options:", options);
    const { response } = await makeAuthenticatedRequest(getApiUrl(endpoint), {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    // clearTimeout(timeoutId);

    if (!response) {
      throw new Error(`${errorMessage}: No response received`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorMessage}: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    if (data === null || data === undefined) {
      throw new Error(`${errorMessage}: Empty response received`);
    }

    return data as T;
    
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  } finally {
    // clearTimeout(timeoutId);
  }
}

// Centralized API request handler with timeout and improved error handling
async function makeDeleteApiRequest(
  endpoint: string,
  options: RequestInit,
  makeAuthenticatedRequest: AuthRequestHandler,
  errorMessage: string,
){
  const controller = new AbortController();
  // const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    console.log("Calling: ", getApiUrl(endpoint));
    const { response } = await makeAuthenticatedRequest(getApiUrl(endpoint), {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    // clearTimeout(timeoutId);

    if (!response) {
      throw new Error(`${errorMessage}: No response received`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorMessage}: ${response.status} ${errorText}`);
    }
    
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    throw error;
  } finally {
    // clearTimeout(timeoutId);
  }
}

// Service object with methods that accept makeAuthenticatedRequest as a parameter
export const CombinedService = {
  async get_chart_data(
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<chartData> {
    return makeApiRequest<chartData>(
      "/api/combined/dashboard",
      { method: "GET" },
      makeAuthenticatedRequest,
      "Unable to fetch chart data",
    );
  },
  async get_all_invoice(
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData[]> {
    return makeApiRequest<invoiceData[]>(
      "/api/invoices",
      { method: "GET" },
      makeAuthenticatedRequest,
      "Unable to fetch invoices",
    );
  },

  async get_all_invoice_without_cheque(
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData[]> {
    return makeApiRequest<invoiceData[]>(
      "/api/invoices/withoutCheque",
      { method: "GET" },
      makeAuthenticatedRequest,
      "Unable to fetch invoices",
    );
  },

  async get_all_invoice_sorted_by_date(
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData[]> {
    return makeApiRequest<invoiceData[]>(
      "/api/invoices/sorted",
      { method: "GET" },
      makeAuthenticatedRequest,
      "Unable to fetch invoices sorted by date",
    );
  },

  async get_all_client(
    makeAuthenticatedRequest?: AuthRequestHandler,
  ): Promise<client[]> {
    return makeApiRequest<client[]>(
      "/api/clients",
      { method: "GET" },
      makeAuthenticatedRequest || (() => Promise.resolve({ response: null })),
      "Unable to fetch clients",
    );
  },

  async get_all_post(
    makeAuthenticatedRequest?: AuthRequestHandler,
  ): Promise<post[]> {
    return makeApiRequest<post[]>(
      "/api/posts",
      { method: "GET" },
      makeAuthenticatedRequest || (() => Promise.resolve({ response: null })),
      "Unable to fetch posts",
    );
  },

  async get_all_invoiceCheques(
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceCheques[]> {
    return makeApiRequest<invoiceCheques[]>(
      "/api/invoiceCheques",
      { method: "GET" },
      makeAuthenticatedRequest,
      "Unable to fetch invoice cheques",
    );
  },

  async get_invoice_by_id(
    id: number,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid invoice ID");
    }
    return makeApiRequest<invoiceData>(
      `/api/invoices/id=${id}`,
      { method: "GET" },
      makeAuthenticatedRequest,
      `Unable to fetch invoice with ID ${id}`,
    );
  },

  async get_invoice_by_invoiceNum(
    invoiceNum: string,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!invoiceNum || typeof invoiceNum !== "string") {
      throw new Error("Invalid invoice ID");
    }
    return makeApiRequest<invoiceData>(
      `/api/invoices/num=${invoiceNum}`,
      { method: "GET" },
      makeAuthenticatedRequest,
      `Unable to fetch invoice with invoice number ${invoiceNum}`,
    );
  },

  async get_invoice_outstanding_summary(
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<(string | number)[][]> {
    return makeApiRequest<(string | number)[][]>(
      "/api/invoices/invoiceSum",
      { method: "GET" },
      makeAuthenticatedRequest,
      "Unable to fetch invoice summary",
    );
  },

  async get_post_client_invoice_summary(
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<postClientInvoiceSummary[]> {
    return makeApiRequest<postClientInvoiceSummary[]>(
      "/api/posts/PostAndClientWithInvoiceSum",
      { method: "GET" },
      makeAuthenticatedRequest,
      "Unable to fetch post client invoice summary",
    );
  },

    async create_invoice(
    newInvoice: invoiceDataOutput,
    makeAuthenticatedRequest?: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!newInvoice || typeof newInvoice !== "object") {
      throw new Error("Invalid invoice data");
    }
    return makeApiRequest<invoiceData>(
      "/api/combined",
      {
        method: "POST",
        body: JSON.stringify(newInvoice),
      },
      makeAuthenticatedRequest || (() => Promise.resolve({ response: null })),
      "Unable to create invoice",
    );
  },

  async create_post(
    newPost: post,
    makeAuthenticatedRequest?: AuthRequestHandler,
  ): Promise<post> {
    if (!newPost || typeof newPost !== "object") {
      throw new Error("Invalid post data");
    }
    return makeApiRequest<post>(
      "/api/posts",
      {
        method: "POST",
        body: JSON.stringify(newPost),
      },
      makeAuthenticatedRequest || (() => Promise.resolve({ response: null })),
      "Unable to create invoice",
    );
  },

  async create_cheque(
    newCheque: cheque,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<cheque> {
    if (!newCheque || typeof newCheque !== "object") {
      throw new Error("Invalid cheque data");
    }
    return makeApiRequest<cheque>(
      "/api/cheques",
      {
        method: "POST",
        body: JSON.stringify(newCheque),
      },
      makeAuthenticatedRequest,
      "Unable to create cheque",
    );
  },

  async create_transaction(
    newInvoiceCheques: invoiceCheques[],
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceCheques[]> {
    if (!Array.isArray(newInvoiceCheques) || newInvoiceCheques.length === 0) {
      throw new Error("Invalid invoice cheques data");
    }
    return makeApiRequest<invoiceCheques[]>(
      "/api/combined/invoiceCheque",
      {
        method: "POST",
        body: JSON.stringify(newInvoiceCheques),
      },
      makeAuthenticatedRequest,
      "Unable to create invoice cheque",
    );
  },

  async update_invoice_by_id(
    id: number,
    updateData: invoiceData,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid invoice ID");
    }
    if (!updateData || typeof updateData !== "object") {
      throw new Error("Invalid invoice data");
    }
    return makeApiRequest<invoiceData>(
      `/api/invoices/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
      makeAuthenticatedRequest,
      `Unable to update invoice with ID ${id}`,
    );
  },

  async update_invoice_details(
    id: number,
    updateData: invoiceData,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid invoice ID");
    }
    if (!updateData || typeof updateData !== "object") {
      throw new Error("Invalid invoice data");
    }
    return makeApiRequest<invoiceData>(
      `/api/combined/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
      makeAuthenticatedRequest,
      `Unable to update invoice details for ID ${id}`,
    );
  },

  async update_post_client_details(
    id: number,
    updateData: post,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid post ID");
    }
    if (!updateData || typeof updateData !== "object") {
      throw new Error("Invalid post data");
    }
    return makeApiRequest<invoiceData>(
      `/api/posts/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
      makeAuthenticatedRequest,
      `Unable to update post and client details for post ID ${id}`,
    );
  },

  async setInvoiceToPaid(
    id: number,
    updateData: invoiceData,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid invoice ID");
    }
    if (!updateData || typeof updateData !== "object") {
      throw new Error("Invalid invoice data");
    }
    return makeApiRequest<invoiceData>(
      `/api/invoices/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
      },
      makeAuthenticatedRequest,
      `Unable to set invoice to paid for ID ${id}`,
    );
  },

  async toggle_invoice_is_paid(
    id: number,
    makeAuthenticatedRequest: AuthRequestHandler,
  ): Promise<invoiceData> {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid invoice ID");
    }
    return makeApiRequest<invoiceData>(
      `/api/invoices/toggleisPaid/${id}`,
      {
        method: "PUT",
      },
      makeAuthenticatedRequest,
      `Unable to toggle invoice's isPaid with ID ${id}`,
    );
  },

  async set_post_to_finish(
    ids: number[],
    makeAuthenticatedRequest?: AuthRequestHandler,
  ): Promise<post[]> {
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => typeof id === "number")
    ) {
      throw new Error("Invalid post IDs");
    }
    return makeApiRequest<post[]>(
      "/api/posts/setEnded",
      {
        method: "PUT",
        body: JSON.stringify(ids),
      },
      makeAuthenticatedRequest || (() => Promise.resolve({ response: null })),
      "Unable to set posts to finished",
    );
  },

  async set_post_to_restart(
    ids: number[],
    makeAuthenticatedRequest?: AuthRequestHandler,
  ): Promise<post[]> {
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => typeof id === "number")
    ) {
      throw new Error("Invalid post IDs");
    }
    return makeApiRequest<post[]>(
      "/api/posts/setNotEnded",
      {
        method: "PUT",
        body: JSON.stringify(ids),
      },
      makeAuthenticatedRequest || (() => Promise.resolve({ response: null })),
      "Unable to set posts to finished",
    );
  },

  async delete_invoice_by_id(
    id: number,
    makeAuthenticatedRequest?: AuthRequestHandler,
  ): Promise<void> {
    if (!id || typeof id !== "number") {
      throw new Error("Invalid invoice ID");
    }
    await makeDeleteApiRequest(
      `/api/combined/invoiceRemove/${id}`,
      { method: "DELETE" },
      makeAuthenticatedRequest || (() => Promise.resolve({ response: null })),
      `Unable to delete invoice with ID ${id}`,
    );
  },

};
