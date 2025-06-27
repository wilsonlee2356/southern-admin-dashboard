"use client";

import { CombinedService } from "@/app/api/invoice";
import { invoiceData, client, post } from "@/types/ObjectTypes/InvoiceType";
import React, { createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthenticatedRequest } from '@/lib/auth';

const PostClientContentContext = createContext<{
  invoiceData: invoiceData[];
  postData: post[]; 
  clientData: client[];
    }>({
        invoiceData: [],
        postData: [],
        clientData: [],
});

export function usePostClientContent() {
    const context = React.useContext(PostClientContentContext);
    if (!context) {
        throw new Error("usePostClientContent must be used within a PostClientContentProvider");
    }
    return context;
}

export function PostClientContentProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [invoiceData, setInvoiceData] = useState<invoiceData[]>([]);
    const [postData, setPostData] = useState<post[]>([]);
    const [clientData, setClientData] = useState<client[]>([]);
    const { makeAuthenticatedRequest } = useAuthenticatedRequest();

    useEffect(() => {
        // if(userLoggedIn && postData.length === 0 && clientData.length === 0) {
        if(status === 'authenticated' && session?.accessToken && invoiceData.length === 0) {
            CombinedService.get_all_invoice(makeAuthenticatedRequest).then((res) => {
                  setInvoiceData(res);
                  console.log("Invoice: "+res);
                CombinedService.get_all_post(makeAuthenticatedRequest).then((res) => {
                  setPostData(res);
                  console.log("Post: "+res);
                  CombinedService.get_all_client(makeAuthenticatedRequest).then((res) => {
                    setClientData(res);
                    console.log("Client: "+res);
                    });
                });
                
            });
            
        }
        
    }, [session, status]);

    const postClientContent = {
        invoiceData,
        postData,
        clientData,
    };

    return (
        <PostClientContentContext.Provider value={postClientContent}>
            {children}
        </PostClientContentContext.Provider>
    );
}