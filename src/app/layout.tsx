"use client";

import { Provider } from "react-redux";
import { store } from "@/stores/store";
import { ThemeConfig } from "@/configs";
import { ContextProvider } from "@/contexts";
import { Sidebar, Footer } from "@/components";
import "@/styles/globals.style.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: ThemeConfig.colors.backgroundMain,
          color: ThemeConfig.colors.textPrimary,
        }}
        className="antialiased"
      >
        <ContextProvider>
          <Provider store={store}>
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 overflow-auto">
                {children}
                <Footer />
              </div>
            </div>
          </Provider>
        </ContextProvider>
      </body>
    </html>
  );
}
