import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "./providers";
import Nav from "./components/Nav";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const roboto = Roboto({ weight: "400", subsets: ["latin-ext"] });

// export const metadata = {
//   title: "Magazynier",
//   description: "Magazynier - aplikacja do zarządzania magazynem",
// };

// import type { Metadata, Viewport } from "next";

const APP_NAME = "Magazynier";
const APP_DEFAULT_TITLE = "Magazynier";
const APP_TITLE_TEMPLATE = "%s - Magazynier";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata = {
  applicationName: APP_NAME,
  title: APP_DEFAULT_TITLE,
  // {
  //   default: APP_DEFAULT_TITLE,
  //   template: APP_TITLE_TEMPLATE,
  // },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  mobileWebAppCapable: "yes",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="dark">
      <head>
        {/* <title>{metadata.title}</title> */}
        {/* <meta name="description" content={metadata.description} /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
      </head>
      <body className={roboto.className}>
        <Providers>
          <div className="md:container md:mx-auto md:px-24">
            <Header />
            <Nav />
            <div className="flex flex-col gap-2 mt-5 p-1">{children}</div>
          </div>
          <ToastContainer autoClose={700} />
        </Providers>
      </body>
    </html>
  );
}
