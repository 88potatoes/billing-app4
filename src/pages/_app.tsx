import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { Layout } from "~/components/Layout";

import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <div className={geist.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
