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
          <div>{event?.description}</div>
        </CardDescription>
      </CardHeader>
      {event.location && (
        <CardContent>
          <p className="text-muted-foreground text-sm">📍 {event.location}</p>
        </CardContent>
      )}
    </Card>
  );
};
