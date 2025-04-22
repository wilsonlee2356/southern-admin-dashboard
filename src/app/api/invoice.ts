import axios from 'axios';
import { invoiceData, client, invoiceDataOutput } from '@/types/ObjectTypes/InvoiceType';

export async function GET_ALL_INVOICES(): Promise<invoiceData[]> {
  const response = await fetch('http://localhost:8080/api/invoices');
  const data = await response.json();
  return data;
}

export async function GET_INVOICE_BY_ID(id: string): Promise<invoiceData> {
  const response = await fetch(`http://localhost:8080/api/invoices/num=${id}`);
  const data = await response.json();
  return data;
}

export async function UPDATE_INVOICE_BY_ID(id: number, updateData: invoiceData): Promise<invoiceData> {

  const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  const data = await response.json();
  return data;
}

export async function DELETE_INVOICE_BY_ID(id: number): Promise<invoiceData> {
  const response = await fetch(`http://localhost:8080/api/invoices/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
}


export async function CREATE_INVOICE(newInvoice: invoiceDataOutput): Promise<invoiceData> {
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