import CourseList from "@/components/CourseList";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Letter from "@/components/Letter";
import Pricing from "@/components/Pricing";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center">
            <Hero />
            <Features />
            <CourseList />
            <Pricing />
            <Letter />
        </div>
    );
}
