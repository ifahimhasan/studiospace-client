import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin, ShieldCheck, Star } from "lucide-react";
import GalleryCarousel from "@/components/studios/GalleryCarousel";
import BookingPanel from "@/components/studios/BookingPanel";
import Reviews from "@/components/studios/Reviews";
import WishlistButton from "@/components/WishlistButton";
import Avatar from "@/components/Avatar";
import { serverGet } from "@/lib/server-api";
import { formatRating, money } from "@/lib/format";

async function getData(id) {
  const [studio, reviews] = await Promise.all([
    serverGet(`/studios/${id}`, { revalidate: 30 }),
    serverGet(`/studios/${id}/reviews`, { revalidate: 30, fallback: [] }),
  ]);
  return { studio, reviews: Array.isArray(reviews) ? reviews : [] };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const studio = await serverGet(`/studios/${id}`, { revalidate: 30 });
  return { title: studio && !studio.notFound ? studio.title : "Studio not found" };
}

export default async function StudioDetailsPage({ params }) {
  const { id } = await params;
  const { studio, reviews } = await getData(id);
  if (!studio || studio.notFound) notFound();

  const specs = [
    ["Max capacity", `${studio.maxCapacity} people`],
    ["Hourly rate", `${money(studio.hourlyRate)} / hr`],
    ["Security deposit", money(studio.securityDeposit || 0)],
    ["Category", studio.category],
  ];

  return (
    <div className="container-ss pt-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-mu">
        <Link href="/studios" className="hover:text-tx">Explore Studios</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/studios?category=${encodeURIComponent(studio.category)}`} className="hover:text-tx">{studio.category}</Link>
        <span aria-hidden="true">/</span>
        <span className="text-tx">{studio.title}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3">
          <span className="self-start rounded-full border border-ln px-2.5 py-1.5 text-xs font-semibold">{studio.category}</span>
          <h1 className="font-display text-[clamp(34px,4.5vw,48px)] leading-[1.04] font-bold tracking-[-0.03em]">{studio.title}</h1>
          <div className="flex flex-wrap gap-[18px] text-[15px] text-mu">
            <span className="inline-flex items-center gap-1.5 font-semibold text-tx">
              <Star size={16} fill="#FFB020" stroke="#FFB020" />
              {formatRating(studio.rating)} <span className="font-normal text-mu">({studio.reviewCount || 0} reviews)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} />
              {studio.location}
            </span>
          </div>
        </div>
        <WishlistButton studioId={String(studio._id)} title={studio.title} />
      </div>

      <div className="mt-7">
        <GalleryCarousel images={[studio.image, ...(studio.gallery || [])].filter(Boolean)} title={studio.title} />
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-10">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {specs.map(([k, v]) => (
              <div key={k} className="rounded-[18px] border border-ln bg-sf p-[18px]">
                <dt className="font-mono text-xs text-mu uppercase">{k}</dt>
                <dd className="mt-1.5 text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="ov-h" className="flex flex-col gap-3.5">
            <h2 id="ov-h" className="font-display text-[30px] font-bold tracking-[-0.02em]">Overview</h2>
            <p className="text-[17px] leading-[1.7] whitespace-pre-line text-mu">{studio.overview}</p>
          </section>

          <section aria-labelledby="am-h" className="flex flex-col gap-4">
            <h2 id="am-h" className="font-display text-[30px] font-bold tracking-[-0.02em]">Amenities</h2>
            {studio.amenities?.length ? (
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 rounded-[14px] border border-ln px-4 py-3.5">
                    <Check size={18} className="text-acct" />
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-mu">The host hasn&apos;t listed amenities yet.</p>
            )}
          </section>

          <section aria-labelledby="host-h" className="card-ss flex flex-wrap items-center gap-5 p-6">
            <Avatar user={{ name: studio.ownerName, image: studio.ownerImage }} size={64} ring />
            <div className="min-w-[200px] flex-1">
              <div className="font-mono text-xs text-mu">HOSTED BY</div>
              <h2 id="host-h" className="mt-1 text-xl font-semibold">{studio.ownerName || "StudioSpace host"}</h2>
              <div className="mt-1 text-sm text-mu">{studio.ownerEmail}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ok">
              <ShieldCheck size={18} /> Verified host
            </span>
          </section>

          <Reviews studio={JSON.parse(JSON.stringify(studio))} initial={reviews} />
        </div>

        <BookingPanel studio={JSON.parse(JSON.stringify(studio))} />
      </div>
    </div>
  );
}
