export interface InvoiceData {
    id: string;
    clientName: string;
    amount: number;
    date: string;
    status: 'pending' | 'paid' | 'overdue';
  }