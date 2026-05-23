import LayoutWrapper from "@/layouts/LayoutWrapper";

const Letter = () => {
    return (
        <LayoutWrapper className="py-20">
            <div className="flex flex-col justify-center gap-10">
                <div className="prose prose-neutral self-center dark:prose-invert">
                    <h3 className="text-center">A Note from BtechBuddy</h3>
                </div>
                <div className="prose prose-neutral mx-auto rounded-md bg-accent p-3.5 dark:prose-invert">
                    <p>
                        Hey there, fellow engineer! We know how overwhelming
                        B.Tech can get — scattered notes, missing syllabi,
                        last-minute PYQ hunting. We built BtechBuddy to fix
                        all of that.
                    </p>
                    <p>
                        Everything you need — syllabus, handwritten notes,
                        previous year questions, and practical files — is right
                        here, organized by semester and branch, ready when you
                        need it.
                    </p>
                    <p>
                        Study smarter. Stress less. You&apos;ve got this.
                    </p>
                    <p>
                        <strong>— The BtechBuddy Team</strong>
                    </p>
                </div>
            </div>
        </LayoutWrapper>
    );
};

export default Letter;
