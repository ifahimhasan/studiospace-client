export default function Loading() {
  return (
    <div className="container-ss pt-8" aria-busy="true" aria-label="Loading studio">
      <div className="skel h-4 w-64" />
      <div className="skel mt-6 h-12 w-[60%]" />
      <div className="skel mt-3 h-4 w-48" />
      <div className="skel mt-7 aspect-[16/9] w-full rounded-[24px]" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-4">
          <div className="skel h-24 w-full rounded-[18px]" />
          <div className="skel h-40 w-full rounded-[18px]" />
        </div>
        <div className="skel h-72 w-full rounded-[24px]" />
      </div>
    </div>
  );
}
