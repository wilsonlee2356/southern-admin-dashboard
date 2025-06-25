"use client";

import { CombinedService } from "@/app/api/invoice";
import { invoiceData, client, post } from "@/types/ObjectTypes/InvoiceType";
import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useSession } from "next-auth/react";

// export async function getPostClientContent() {
//     const { data: session, status } = useSession();
//     if(status === 'authenticated' && session?.accessToken){
//       const postData = await CombinedService.get_all_post(session.accessToken);
//       const clientData = await CombinedService.get_all_client(session.accessToken);

//       return { postData, clientData };
//     }
//     return {};
// }

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

    // const { userLoggedIn } = useAuth();

  //   useEffect(() => {
  //     console.log(session, ", ", status);
  //   const fetchData = async () => {
  //     if (status === 'authenticated' && session?.accessToken) {
  //       try {
  //         const response = await fetch('http://localhost:8080/api/cheques', {
  //           method: 'GET',
  //           headers: {
  //             Authorization: `Bearer ${session.accessToken}`,
  //             'Content-Type': 'application/json',
  //           },
  //         });

  //         if (response.status === 401) {
  //           console.log('401 Received: Redirecting to sign-in');
  //           return;
  //         }
  //         if (response.ok) {
  //           const result = await response.text();
  //           console.log(result);
  //         } else {
  //           const errorData = await response.json();
  //           console.log('Failed to fetch data');
  //           // setError(errorData.message || 'Failed to fetch data');
  //         }
  //       } catch (err) {
  //           console.log('Failed', err);
  //       //   setError('Error: ' + (err as Error).message);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [session, status]);

    useEffect(() => {
        // if(userLoggedIn && postData.length === 0 && clientData.length === 0) {
        if(status === 'authenticated' && session?.accessToken) {
            CombinedService.get_all_invoice(session.accessToken).then((res) => {
                  setInvoiceData(res);
                  console.log("Invoice: "+res);
            });
            CombinedService.get_all_post(session.accessToken).then((res) => {
                  setPostData(res);
                  console.log("Post: "+res);
              });
            CombinedService.get_all_client(session.accessToken).then((res) => {
                  setClientData(res);
                  console.log("Client: "+res);
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