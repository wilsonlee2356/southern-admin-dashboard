"use client";

import { CombinedService } from "@/app/api/invoice";
import { client, post } from "@/types/ObjectTypes/InvoiceType";
import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";

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

    const { userLoggedIn } = useAuth();

    useEffect(() => {
        if(userLoggedIn && postData.length === 0 && clientData.length === 0) {
            getPostClientContent().then(({ postData, clientData }) => {
                setPostData(postData);
                setClientData(clientData);
            });
        }
        
    }, [userLoggedIn]);

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