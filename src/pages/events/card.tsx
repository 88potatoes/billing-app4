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
  event: calendar_v3.Schema$Events["items"];
};

export const EventsCard = ({ event }: Props) => {
  const startTime = event.start?.dateTime
    ? new Date(event.start.dateTime)
    : null;
  const endTime = event.end?.dateTime ? new Date(event.end.dateTime) : null;
  const duration =
    startTime && endTime ? differenceInMinutes(endTime, startTime) : null;

  return (
    <div className="grid gap-4">
      {event?.map((event) => {
        const startTime = event.start?.dateTime
          ? new Date(event.start.dateTime)
          : null;
        const endTime = event.end?.dateTime
          ? new Date(event.end.dateTime)
          : null;
        const duration =
          startTime && endTime ? differenceInMinutes(endTime, startTime) : null;

        return (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.summary || "Untitled Event"}</CardTitle>
              <CardDescription>
                {startTime && (
                  <span>
                    {format(startTime, "EEEE, MMMM d, yyyy")} •{" "}
                    {format(startTime, "h:mm a")}
                    {endTime && ` - ${format(endTime, "h:mm a")}`}
                    {duration && duration >= 60
                      ? ` (${Math.floor(duration / 60)}h ${duration % 60}m)`
                      : duration
                        ? ` (${duration}m)`
                        : ""}
                  </span>
                )}
                <span>
                  {event?.description}
                </span>
              </CardDescription>
            </CardHeader>
            {event.location && (
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  📍 {event.location}
                </p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
