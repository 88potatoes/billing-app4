import Head from "next/head";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>Calendar Billing - Turn Events into Invoices</title>
        <meta
          name="description"
          content="Automatically generate invoices from your Google Calendar events. Simple, fast, and efficient billing for service professionals."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-semibold">Calendar Billing</div>
          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/events">
                <Button>Go to App</Button>
              </Link>
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight">
            Turn Calendar Events into Invoices Automatically
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Connect your Google Calendar and generate professional invoices from
            your appointments. Save time on billing and focus on your work.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="text-base">
                  Get Started Free
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="text-base">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/events">
                <Button size="lg" className="text-base">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-3xl font-bold">
              How It Works
            </h2>
            <div className="grid gap-12 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Connect Calendar
                </h3>
                <p className="text-muted-foreground">
                  Link your Google Calendar with one click. Your events stay
                  private and secure.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">✏️</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Add Billing Details
                </h3>
                <p className="text-muted-foreground">
                  Include customer information and line items in your event
                  descriptions.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl">🧾</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Generate Invoices
                </h3>
                <p className="text-muted-foreground">
                  Create professional invoices automatically from selected
                  events.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to streamline your billing?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Start generating invoices from your calendar today.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-base">
                Get Started Free
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/events">
              <Button size="lg" className="text-base">
                Go to Dashboard
              </Button>
            </Link>
          </SignedIn>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Calendar Billing. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
