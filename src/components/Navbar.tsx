import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="w-full border-b border-black/[.08] dark:border-white/[.145]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="p-4">
                <Image
                  src="/logo.png"
                  alt="BD Jobs Logo"
                  width={240}
                  height={80}
                />
              </div>
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link
              href="/"
              className={`${
                router.pathname === "/"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-gray-500 hover:text-foreground"
              } px-1 py-2 text-sm font-medium`}
            >
              Jobs
            </Link>
            <Link
              href="/blog"
              className={`${
                router.pathname === "/blog"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-gray-500 hover:text-foreground"
              } px-1 py-2 text-sm font-medium`}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
