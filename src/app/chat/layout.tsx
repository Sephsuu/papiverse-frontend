// app/layout.tsx or pages/_app.tsx

import { SocketProvider } from "@/contexts/SocketContexts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <SocketProvider>
          {children}
        </SocketProvider>
  );
}