import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
      <header className="border-b border-rule pb-10 pt-10 lg:pb-14 lg:pt-16">
        <Skeleton className="h-2 w-40" />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <Skeleton className="h-10 w-72 lg:h-12 lg:w-96" />
            <Skeleton className="mt-4 h-3 w-56" />
          </div>
          <Skeleton className="h-12 w-24" />
        </div>

        <Skeleton className="mt-8 h-3 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-3 w-full max-w-xl" />
        <Skeleton className="mt-6 h-2 w-44" />
      </header>

      <div className="py-10 lg:py-14">
        <Skeleton className="h-2 w-24" />
        <div className="mt-5 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="border-t border-rule py-4">
              <Skeleton className="h-2 w-24" />
              <Skeleton className="mt-3 h-5 w-16" />
            </div>
          ))}
        </div>

        <Skeleton className="mt-16 h-2 w-32" />
        <div className="mt-5 max-w-3xl">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="border-t border-rule py-4">
              <div className="flex items-baseline justify-between">
                <Skeleton className="h-3 w-44" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="mt-3 h-px w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
