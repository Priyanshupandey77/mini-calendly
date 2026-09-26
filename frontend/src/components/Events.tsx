import EventForm from "./CreateEventForm";

export default function Events() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-indigo-600">Events</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Create an event
        </h1>

        <p className="mt-2 text-slate-500">
          Create a scheduling event that people can use to book time with you.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <EventForm />
      </div>
    </div>
  );
}
