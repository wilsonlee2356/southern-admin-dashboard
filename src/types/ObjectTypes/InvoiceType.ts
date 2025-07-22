export type Invoice = {
  id: string;
  name: string;
  amount: number;
  postcode: string;
  date: string;
  status: string;
};

export type InvoiceSearch = {
  invoiceNum: string;
  clientName: string;
  postcode: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type InvoiceArray = {
  //dataArray: invoice[];
  dataArray: InvoiceData[];
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
  base64StringChequeCopy: null | string;
  invoiceChequesList: InvoiceCheques[];
};

export type InvoiceCheques = {
  invoice: InvoiceData;
  cheque: cheque;
  amount: number;
  paymentDate: any;
};

export type InvoiceData = {
  invoiceId: number;
  invoiceNum: string;
  post: post;
  //client: client;
  invoiceDate: any;
  amount: number;
  paidAmount: number;
  isPaid: boolean;
  isPending: boolean;
  settlementDate: string | null | undefined;
  statementId: number | null | undefined;
  invoiceChequesList: InvoiceCheques[];
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

export type chartData = {
  invoiceChartData: invoiceChartData[];
  invoiceChequeChartData: invoiceChequeChartData[];
};

export type invoiceChartData = {
  invoiceDate: string;
  amount: number;
  paidAmount: number;
};

export type invoiceChequeChartData= {
  amount: number;
  paymentDate: string;
};

export type invoicePostList = {
  invoiceList: InvoiceData[];
  postList: post[];
}