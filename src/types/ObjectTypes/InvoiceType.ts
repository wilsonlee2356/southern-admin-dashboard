export type invoice = {
  id: string;
  name: string;
  amount: number;
  postcode: string;
  date: string;
  status: string;
};

export type invoiceArray = {
  //dataArray: invoice[];
  dataArray: invoiceData[];
};

export type PaidAmountsType = {
  invoiceId: number;
  amount: number;
};

export type client = {
  clientId: number;
  clientName: string;
  fullName: string;
  address: string;
  createDate: string;
  updateDate: string;
};

export type post = {
  postId: number;
  postcode: string;
  buildingAddress: string;
  streetAddress: string;
  client: client;
  isEnded: boolean;
  createDate: string;
  updateDate: string;
};

export type cheque = {
  chequeId: number;
  chequeCopy: null | string;
  invoiceChequesList: invoiceCheques[];
};

export type invoiceCheques = {
  invoice: invoiceData;
  cheque: cheque;
  amount: number;
  paymentDate: Date;
};

export type invoiceData = {
  invoiceId: number;
  invoiceNum: string;
  post: post;
  //client: client;
  invoiceDate: Date;
  amount: number;
  paidAmount: number;
  isPaid: boolean;
  settlementDate: string | null | undefined;
  statementId: number | null | undefined;
  invoiceChequesList: invoiceCheques[];
  createDate: Date;
  updateDate: Date;
};

export type clientOutput = {
  clientName: string;
  fullName: string | null | undefined;
  address: string | null | undefined;
};

export type postOutput = {
  postcode: string;
  buildingAddress: string;
  streetAddress: string;
  client: clientOutput;
};

export type invoiceDataOutput = {
  invoiceNum: string;
  post: postOutput;
  //client: clientOutput;
  invoiceDate: Date | null | undefined;
  amount: number;
  paidAmount: number;
  settlementDate: string | null | undefined;
  statementId: number | null | undefined;
};

export type invoiceOutstandingSummary = {
  numOfInvoices: number;
  totalOutstanding: number;
  clientName: string;
};

export type postClientInvoiceSummary = {
  numberOfInvoices: number;
  totalAmount: number;
  outstanding: number;
  post_id: number;
  postcode: string;
  ended: boolean;
  client_name: string;
};
