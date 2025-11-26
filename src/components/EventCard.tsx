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

  // Check if descriptionData is an array
  const isArray = Array.isArray(descriptionData);

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
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {descriptionData ? (
          isArray ? (
            // Render array of items
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
            // Render single object
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
