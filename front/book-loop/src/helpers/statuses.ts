export const VALID_STATUSES = ["favorites", "to-read", "reading", "finished"] as const;
export type RouteStatus = typeof VALID_STATUSES[number];

//  подписи для табов
export const STATUS_LABEL: Record<RouteStatus, string> = {
  favorites: "Favorites",
  "to-read": "Want to read",
  reading: "Reading",
  finished: "Finished",
};

// Маппинг статуса роутера query для бекенда (/api/books/my-books)
export type MyBooksQuery =
  | { favorites: "true" }
  | { want: "true" }
  | { status: "reading" | "finished" | "unread" };

export function routeStatusToQuery(status: RouteStatus): MyBooksQuery {
  switch (status) {
    case "favorites":
      return { favorites: "true" };
    case "to-read":
      return { want: "true" };
    case "reading":
      return { status: "reading" };
    case "finished":
      return { status: "finished" };
  }
}

export function isRouteStatus(v: unknown): v is RouteStatus {
  return typeof v === "string" && (VALID_STATUSES as readonly string[]).includes(v);
}


