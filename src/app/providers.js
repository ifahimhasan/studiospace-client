"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      theme={resolvedTheme === "studiolight" ? "light" : "dark"}
      toastOptions={{
        style: { borderRadius: 16, fontFamily: "var(--font-geist-sans)" },
      }}
    />
  );
}

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={["studiodark", "studiolight"]}
      defaultTheme="studiodark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
      <ThemedToaster />
    </ThemeProvider>
  );
}
