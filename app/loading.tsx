import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the console's geometry: rail rows left, map area right, readout below. */
export default function Loading() {
  return (
    <div className="flex flex-col lg:h-[calc(100dvh-3.5rem)] lg:overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Map area */}
        <section className="relative order-1 min-h-[26rem] flex-1 lg:order-2 lg:min-h-0">
          <div className="absolute left-5 top-6 lg:left-10 lg:top-12">
            <Skeleton className="h-2 w-32" />
            <Skeleton className="mt-5 h-14 w-72 lg:h-24 lg:w-[26rem]" />
            <Skeleton className="mt-6 h-3 w-64" />
            <Skeleton className="mt-2 h-3 w-52" />
          </div>
        </section>

        {/* Index rail */}
        <aside className="order-2 flex shrink-0 flex-col border-t border-rule lg:order-1 lg:w-[27rem] lg:border-r lg:border-t-0">
          <div className="flex items-baseline justify-between border-b border-rule px-5 pb-3 pt-6 lg:px-8">
            <Skeleton className="h-2 w-28" />
            <Skeleton className="h-2 w-16" />
          </div>

          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="border-b border-rule px-5 py-4 lg:px-8">
              <div className="flex items-baseline gap-3">
                <Skeleton className="h-2 w-6 shrink-0" />
                <Skeleton className="h-3.5 w-40" />
              </div>
              <Skeleton className="mt-2.5 ml-10 h-2.5 w-52" />
              <Skeleton className="mt-4 ml-10 h-px w-full" />
            </div>
          ))}
        </aside>
      </div>

      {/* Readout */}
      <footer className="shrink-0 border-t border-rule">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="border-b border-r border-rule px-5 py-4 last:border-r-0 lg:border-b-0 lg:px-8"
            >
              <Skeleton className="h-2 w-20" />
              <Skeleton className="mt-3 h-5 w-12" />
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
