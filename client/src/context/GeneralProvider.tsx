import { Message } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GeneralContextProps {
    globalMessageState: Message | null;
    setGlobalMessageState: React.Dispatch<React.SetStateAction<Message | null>>;
    showReplyPreview: boolean;
    setShowReplyPreview: React.Dispatch<React.SetStateAction<boolean>>;
}

const GeneralContext = createContext<GeneralContextProps | undefined>(undefined);

export const GeneralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [globalMessageState, setGlobalMessageState]  = useState<Message | null>(null);
    const [showReplyPreview, setShowReplyPreview] = useState(false);

    return (
        <GeneralContext.Provider value={{ globalMessageState, setGlobalMessageState, showReplyPreview, setShowReplyPreview }}>
            {children}
        </GeneralContext.Provider>
    );
};

export const useGeneralContext = (): GeneralContextProps => {
    const context = useContext(GeneralContext);
    if (!context) {
        throw new Error('useGeneralContext must be used within a GeneralProvider');
    }
    return context;
};