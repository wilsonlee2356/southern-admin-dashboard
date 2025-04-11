export type invoice = {
    id: string;
    name: string;
    amount: number;
    postcode: string;
    date: string;
    status: string;
}
  
export type invoiceArray = {
  //dataArray: invoice[];
  dataArray: invoiceData[];
}

export type client = {
  clientId: number;
  clientName: string;
  fullName: string;
  createDate: string;
  updateDate: string;
  postlist: post[] | null | undefined;
}

export type post = {
  postId: number;
  client: client;
  postcode: string;
  orders: number;
  createDate: string;
  updateDate: string;
}

export type invoiceData = {
  invoiceId: number;
  invoiceNum: string;
  post: post;
  invoiceDate: string;
  amount: number;
  order: number;
  settlementDate: string | null | undefined;
  statementId: number | null | undefined;
  chequeId: number | null | undefined;
  createDate: string;
  updateDate: string;
}


