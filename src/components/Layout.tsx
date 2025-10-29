import { AuthProvider } from "@/context/AuthContext";
import type { LayoutProps } from "rwsdk/router";

export async function MainLayout({ children, requestInfo }: LayoutProps) {
  const user = requestInfo?.ctx?.user ?? {}; // Bug if user is undefined or null?
  // TODO: Could validate permissions here using ctx.user

  return (
    <AuthProvider user={user}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        {user.name}
      </h1>
      <div className="layout">{children}</div>
    </AuthProvider>
  );
}
