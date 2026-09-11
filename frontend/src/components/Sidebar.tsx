import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div>
      <h1>Mini Calendly</h1>
      <NavLink to="/dashboard">Overview</NavLink>
      <NavLink to="/dashboard/events">Events</NavLink>
      <NavLink to="/dashboard/availability">Availability</NavLink>
    </div>
  );
}
