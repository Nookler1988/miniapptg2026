import "@/styles/globals.css";
import SafeAreaProvider from "@/components/SafeAreaProvider";

export default function App({ Component, pageProps }) {
  return (
    <SafeAreaProvider>
      <Component {...pageProps} />
    </SafeAreaProvider>
  );
}
