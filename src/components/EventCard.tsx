import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { format, differenceInMinutes } from "date-fns";
import { calendar_v3 } from "googleapis";

type Props = {
  event: calendar_v3.Schema$Event;
};

// Type guard to check if data is billing format
function isBillingData(
  data: unknown
): data is { customerInfo: Record<string, unknown>; items: unknown[] } {
  return (
    typeof data === "object" &&
    data !== null &&
    "customerInfo" in data &&
    "items" in data
  );
}

export const EventCard = ({ event }: Props) => {
  const startTime = event.start?.dateTime
    ? new Date(event.start.dateTime)
    : null;
  const endTime = event.end?.dateTime ? new Date(event.end.dateTime) : null;
  const duration =
    startTime && endTime ? differenceInMinutes(endTime, startTime) : null;

  // Parse description JSON
  let descriptionData: Record<string, unknown> | Record<string, unknown>[] | null = null;
  if (event.description) {
    try {
      descriptionData = JSON.parse(event.description);
    } catch {
      // If parsing fails, we'll just show the raw description
    }
  }

  // Check if this is billing format data
  const isBillingFormat = isBillingData(descriptionData);
  const isArray = Array.isArray(descriptionData);

 console.log(event); 

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.summary || "Untitled Event"}</CardTitle>
        <CardDescription>
          {startTime && (
            <div>
              {format(startTime, "EEEE, MMMM d, yyyy")} •{" "}
              {format(startTime, "h:mm a")}
              {endTime && ` - ${format(endTime, "h:mm a")}`}
              {duration && duration >= 60
                ? ` (${Math.floor(duration / 60)}h ${duration % 60}m)`
                : duration
                  ? ` (${duration}m)`
                  : ""}
            </div>
          )}
          <a href={event.htmlLink} target="_invoiceWindow" rel="noreferrer">
            link
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {descriptionData ? (
          isBillingFormat ? (
            // Render billing format with customerInfo and items
            <>
              {/* Customer Info Section */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">Customer Information</h3>
                <div className="rounded-md bg-muted p-3 text-sm">
                  {Object.entries(descriptionData.customerInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium capitalize">{key}:</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Section */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">Items</h3>
                <div className="space-y-2">
                  {descriptionData.items.map((item, index) => (
                    <div key={index} className="rounded-md bg-muted p-3 text-sm">
                      {Object.entries(item as Record<string, unknown>).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="font-medium capitalize">{key}:</span>
                          <span className="text-muted-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : isArray ? (
            // Render array of items (simple format)
            <div className="space-y-2">
              {descriptionData.map((item, index) => (
                <div key={index} className="rounded-md bg-muted p-3 text-sm">
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="font-medium capitalize">{key}:</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            // Render single object (simple format)
            <div className="rounded-md bg-muted p-3 text-sm">
              {Object.entries(descriptionData).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="font-medium capitalize">{key}:</span>
                  <span className="text-muted-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          )
        ) : (
          event.description && (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          )
        )}
        {event.location && (
          <p className="text-sm text-muted-foreground">📍 {event.location}</p>
        )}
      </CardContent>
    </Card>
  );
};
