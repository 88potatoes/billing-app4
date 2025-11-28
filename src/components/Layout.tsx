import Link from "next/link";
import { useRouter } from "next/router";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const isLandingPage = router.pathname === "/";

  // Don't wrap landing page with this layout (it has its own)
  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-semibold">
              Calendar Billing
            </Link>
            <SignedIn>
              <nav className="flex gap-6">
                <Link
                  href="/events"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    router.pathname === "/events"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Events
                </Link>
              </nav>
            </SignedIn>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
