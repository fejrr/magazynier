
import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "./providers";
import Nav from "./components/Nav";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const roboto = Roboto({ weight: "400", subsets: ["latin-ext"] });

export const metadata = {
  title: "Magazynier",
  description: "Magazynier - aplikacja do zarządzania magazynem",
};


export default function RootLayout({ children }) {

  return (
    <html lang="pl" className="dark">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <Providers>
        <body className={roboto.className}>
            <div className="md:container md:mx-auto md:px-24">
                <Header />
                <Nav />
                <div className="flex flex-col gap-2 md:w-3/4 mt-5 p-1">
                {children}
                </div>
            </div>
            <ToastContainer autoClose={700} />
        </body>
      </Providers>
    </html>
  );
}
