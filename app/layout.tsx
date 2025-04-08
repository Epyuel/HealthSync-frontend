'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { Provider as StoreProvider } from "react-redux";
import store from "@/redux/store";
import { Toaster } from "@/components/ui/toaster";
import { StyledEngineProvider } from "@mui/material";
import NextAuthSessionProvider from "@/components/context/Session";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StyledEngineProvider injectFirst>
      <html lang="en">
        <body className={inter.className}>
          <StoreProvider store={store} >
            {/* <CookieProvider cookie={getCookie()}> */}
              <NextAuthSessionProvider>
                {children}
                <Toaster />
              </NextAuthSessionProvider> 
            {/* </CookieProvider> */}
          </StoreProvider>
        </body>
      </html>
    </StyledEngineProvider>
  );
}
