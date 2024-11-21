import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[80px_1fr_60px] items-center justify-items-center min-h-screen bg-gradient-to-br from-blue-50/40 to-blue-100/40 dark:from-gray-800/40 dark:to-gray-900/40 p-8 sm:p-20 gap-16 font-[family-name:var(--font-geist-sans)] text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="row-start-1 w-full flex justify-between items-center px-4 sm:px-10">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={30}
          priority
        />
        <nav>
          <ul className="flex gap-4 sm:gap-8 text-sm sm:text-base">
            <li className="hover:underline cursor-pointer"><a href="/account/register">Register</a></li>
            <li className="hover:underline cursor-pointer"><a href="/account/login">Login</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="row-start-2 flex flex-col gap-16 items-center">
        {/* Hero Section */}
        <section className="text-center max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
            Welcome to <span className="text-blue-600 dark:text-blue-400">EzChat</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
            Easy to communicate with people around the world!
          </p>
        </section>

        {/* Features Section
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl text-center">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Performance</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Next.js ensures your app loads lightning fast for a great user experience.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Flexibility</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Use the tools you love while building with modern frameworks.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Scalability</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Grow your app seamlessly, from small projects to enterprise solutions.
            </p>
          </div>
        </section> */}
        <section>

        </section>
      </main>

      {/* Footer */}
      <footer className="row-start-3 w-full text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <p>
          Powered by{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Next.js
          </a>
        </p>
      </footer>
    </div>
  );
}
