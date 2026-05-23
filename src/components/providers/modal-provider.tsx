"use client";

import { useEffect, useState } from "react";
import EmbedModal from "../modals/embed-modal";
import FeedbackModal from "../modals/feedback-modal";
import DatesheetModal from "../modals/datesheet-modal";
import SearchModal from "../modals/search-modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <SearchModal />
            <EmbedModal />
            <DatesheetModal />
            <FeedbackModal />
        </>
    );
};

export default ModalProvider;
