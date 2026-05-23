import NotFoundClient from "@/components/NotFoundClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Oops! Page Not Found",
    description:
        "Oops! It seems like you've wandered into uncharted territory. BtechBuddy couldn't locate the page you're looking for. Don't worry, let's guide you back.",
};

const NotFound = () => {
    return <NotFoundClient />;
};

export default NotFound;
