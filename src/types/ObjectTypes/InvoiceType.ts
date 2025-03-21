export type invoice = {
    id: string;
    name: string;
    amount: number;
    postcode: string;
    date: string;
    status: string;
}
  
  export type invoiceArray = {
    dataArray: invoice[];
  }