import { AuthProvider } from "@/context/AuthContext";
import type { LayoutProps } from "rwsdk/router";

export async function MainLayout({ children, requestInfo }: LayoutProps) {
  const user = requestInfo?.ctx?.user ?? {}; // Bug if user is undefined or null?

  return (
    <AuthProvider user={user}>
      <div className="layout">{children}</div>
    </AuthProvider>
  );
}
