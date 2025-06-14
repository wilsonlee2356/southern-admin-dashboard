"use client";

import { CombinedService } from "@/app/api/invoice";
import { client, post } from "@/types/ObjectTypes/InvoiceType";
import React, { createContext, useEffect, useState } from "react";

export async function getPostClientContent() {
    const postData = await CombinedService.get_all_post();
    const clientData = await CombinedService.get_all_client();
    
    return { postData, clientData };
}

const PostClientContentContext = createContext<{
  postData: post[]; 
  clientData: client[];
    }>({
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
    const [postData, setPostData] = useState<post[]>([]);
    const [clientData, setClientData] = useState<client[]>([]);

    useEffect(() => {
        getPostClientContent().then(({ postData, clientData }) => {
            setPostData(postData);
            setClientData(clientData);
        });
    }, []);

    const postClientContent = {
        postData,
        clientData,
    };

    return (
        <PostClientContentContext.Provider value={postClientContent}>
            {children}
        </PostClientContentContext.Provider>
    );
}