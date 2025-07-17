"use client";

import { CombinedService } from "@/app/api/invoice";
import { invoiceData, client, post } from "@/types/ObjectTypes/InvoiceType";
import React, { createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuthenticatedRequest } from "@/lib/auth";

const PostClientContentContext = createContext<{
  invoiceData: invoiceData[];
  postData: post[];
  clientData: client[];
  loading: boolean;
  refreshLoading: boolean;
  setInvoiceData: any;
  updateData: () => void;
  updateInvoiceData: () => void;
  updatePostData: () => void;
}>({
  invoiceData: [],
  postData: [],
  clientData: [],
  loading: false,
  refreshLoading: false,
  setInvoiceData: () => {},
  updateData: () => {},
  updateInvoiceData: () => {},
  updatePostData: () => {},
});

export function usePostClientContent() {
  const context = React.useContext(PostClientContentContext);
  if (!context) {
    throw new Error(
      "usePostClientContent must be used within a PostClientContentProvider",
    );
  }
  return context;
}

export function PostClientContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [invoiceData, setInvoiceData] = useState<invoiceData[]>([]);
  const [postData, setPostData] = useState<post[]>([]);
  const [clientData, setClientData] = useState<client[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(0);
  const { makeAuthenticatedRequest } = useAuthenticatedRequest();

  useEffect(() => {
    // if(userLoggedIn && postData.length === 0 && clientData.length === 0) {
    if (
      status === "authenticated" &&
      session?.accessToken &&
      invoiceData.length === 0
    ) {
      isLoading(true);
      setCountdown(15);
      CombinedService.get_all_invoice_without_cheque(makeAuthenticatedRequest).then((res) => {
        console.log("Invoice: " + res);
        setInvoiceData(res);
        CombinedService.get_all_post(makeAuthenticatedRequest).then((res) => {
          console.log("Post: " + res);
          setPostData(res);
          CombinedService.get_all_client(makeAuthenticatedRequest).then((res) => {
              console.log("Client: " + res);
              setClientData(res);
              isLoading(false);
            },
          );
        });
      });
    }
  }, [session, status]);

  useEffect(() => {
    //initialize isPending for each invoice
    invoiceData.forEach((invoice) => {
      invoice.isPending = false;
    });
  }, [invoiceData]);

  // useEffect(() => {
  //   if (countdown <= 0) {
  //       return; // Stop the countdown when it reaches zero
  //   }
  //   if(!loading){
  //     setCountdown(0); // Reset countdown when not refreshing
  //     return; // No countdown if not refreshing
  //   }
  //     const timer = setInterval(() => {
  //       setCountdown((prevSeconds) => prevSeconds - 1);
  //     }, 1000); // Update every 1000 milliseconds (1 second)
  //     console.log("Countdown started: " + countdown);
  //     // Clean up the interval when the component unmounts or secondsLeft reaches zero
  //     return () => clearInterval(timer);
  // }, [countdown]);

  // useEffect(() => {
    
  //   if (refreshCountdown <= 0) {
  //       return; // Stop the countdown when it reaches zero
  //   }
  //   if(!refreshLoading){
  //     setRefreshCountdown(0); // Reset countdown when not refreshing
  //     return; // No countdown if not refreshing
  //   }
  //     const timer = setInterval(() => {
  //       setRefreshCountdown((prevSeconds) => prevSeconds - 1);
  //     }, 1000); // Update every 1000 milliseconds (1 second)
  //     console.log("Refresh Countdown started: " + refreshCountdown);
  //     // Clean up the interval when the component unmounts or secondsLeft reaches zero
  //     return () => clearInterval(timer);
  // }, [refreshCountdown]);

  const updateData = () =>{
    if(status === "authenticated"){
        console.log("Refreshing data");
        setRefreshLoading(true);
        setRefreshCountdown(15); // Set countdown to 5 seconds
        CombinedService.get_all_invoice_without_cheque(makeAuthenticatedRequest).then((res) => {
          setInvoiceData(res);
          console.log("Invoice: " + res);
          CombinedService.get_all_post(makeAuthenticatedRequest).then((res) => {
            setPostData(res);
            console.log("Post: " + res);
            CombinedService.get_all_client(makeAuthenticatedRequest).then((res) => {
                setClientData(res);
                console.log("Client: " + res);
                setRefreshLoading(false);
              },
            );
          });
        });
    }
  }

  const updateInvoiceData = () =>{
    if(status === "authenticated"){
        console.log("Refreshing data");
        CombinedService.get_all_invoice(makeAuthenticatedRequest).then((res) => {
          setInvoiceData(res);
          console.log("Invoice: " + res);
        });
    }
  }

  const updatePostData = () =>{
    if(status === "authenticated"){
        console.log("Refreshing data");
        CombinedService.get_all_post(makeAuthenticatedRequest).then((res) => {
            setPostData(res);
            console.log("Post: " + res);
        });
    }
  }

  const postClientContent = {
    invoiceData,
    postData,
    clientData,
    loading,
    refreshLoading,
    setInvoiceData,
    updateData,
    updateInvoiceData,
    updatePostData,
  };

  return (
    <PostClientContentContext.Provider value={postClientContent}>
      {children}
    </PostClientContentContext.Provider>
  );
}
