import LayoutWrapper from "@/layouts/LayoutWrapper";
import Link from "next/link";
import NavLinks from "./NavLinks";
import NavMenu from "./NavMenu";

const Navbar = () => {
    return (
        <nav className="sticky inset-x-0 top-0 z-50 h-14 w-full bg-background/50 backdrop-blur-lg transition-all">
            <LayoutWrapper className="md:max-w-none md:px-16">
                <div className="flex h-14 items-center justify-between">
                    <div className="flex items-center gap-x-10">
                        <Link
                            href="/"
                            aria-label="home page"
                            className="z-40 flex items-center gap-x-2 font-semibold"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-black">
                                BB
                            </div>
                            <p className="text-lg text-neutral-900 transition hover:opacity-75 dark:text-neutral-50">
                                BtechBuddy
                            </p>
                        </Link>
                        <div className="hidden lg:flex">
                            <NavMenu />
                        </div>
                    </div>
                    <NavLinks />
                </div>
            </LayoutWrapper>
        </nav>
    );
};

export default Navbar;
