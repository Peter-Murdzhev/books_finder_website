"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [client] = useState(() => new QueryClient());
    const [persister, setPersister] = useState<any>(null);

    useEffect(() =>{
        const pers =  createAsyncStoragePersister({
            storage: window.sessionStorage,
        })

        setPersister(pers);
    },[])

    if(!persister){
        return null;
    }

    return (
        <PersistQueryClientProvider
            client={client}
            persistOptions={{ persister }}
        >
            {children}
        </PersistQueryClientProvider>
    );
}