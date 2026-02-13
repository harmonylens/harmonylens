import { useParams, Navigate } from "react-router-dom";
import Masonry from "../components/Masonry";
import { events, photosByEvent } from "../data/photos";

export default function EventPage() {
  const { event } = useParams<{ event: string }>();
  if (!event) return <Navigate to="/" replace />;

  // basic guard
  if (!events.includes(event)) return <Navigate to="/" replace />;

  return <Masonry photos={photosByEvent(event)} />;
}
