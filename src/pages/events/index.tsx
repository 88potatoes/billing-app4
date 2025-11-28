import Head from "next/head";
import { Calendar } from "~/components/ui/calendar";
import { type DateRange } from "react-day-picker";

import { api } from "~/utils/api";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { EventCard } from "~/components/EventCard";

export default function EventsPage() {
  const { mutate: authWithGoogleCalendar } =
    api.user.authWithGoogleCalendar.useMutation();

  const { mutate: createInvoices } = api.workflow.createInvoices.useMutation();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 10, 23),
    to: new Date(2025, 10, 30),
  });

  const { data: events } = api.workflow.getEvents.useQuery(
    dateRange?.from && dateRange?.to
      ? { startDate: dateRange.from, endDate: dateRange.to }
      : undefined,
    { enabled: !!dateRange?.from && !!dateRange?.to },
  );

  console.log("events", events);

  return (
    <>
      <Head>
        <title>Events - Calendar Billing</title>
        <meta name="description" content="View and manage calendar events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto max-w-6xl p-4">
        <div className="mb-6 flex flex-col gap-4">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-lg border shadow-sm"
          />
          <Button
            onClick={() => {
              authWithGoogleCalendar(undefined, {
                onSuccess: (data) => window.open(data.url, "_blank"),
              });
              console.log("hi");
            }}
          >
            Google
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Events</h2>
          <div className="flex w-full gap-4">
            <div className="flex-1">
              {events?.items && events.items.length > 0 ? (
                <div className="grid gap-4">
                  {events.items.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No events found for the selected date range.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <Button
              onClick={() => {
                const items = JSON.parse(
                  events?.items?.[0]?.description ?? "",
                ).items;

                createInvoices({
                  desinationFolderId: "1KpOPpP8pldl9fybkwLYitb4sHtDb_-iu",
                  sheetName: "Invoice",
                  customerInfo: {
                    name: "Eric Lang",
                    email: "eric@ericlang.dev",
                    specifiedId:
                      events?.items?.[0]?.customer?.specifiedId ?? "",
                  },
                  items: items ?? [],
                });
              }}
            >
              Generate Invoices
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
