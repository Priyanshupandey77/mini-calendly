import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Overview",
    path: "/dashboard",
  },
  {
    name: "Events",
    path: "/dashboard/events",
  },
  {
    name: "Availability",
    path: "/dashboard/availability",
  },
  {
    name: "Bookings",
    path: "/dashboard/bookings",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col p-4">
        <div className="mb-6 px-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4">
          <p className="px-3 text-xs text-slate-400">Mini Calendly</p>
        </div>
      </div>
    </aside>
  );
}
