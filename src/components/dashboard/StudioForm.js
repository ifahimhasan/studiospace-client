"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { uploadToImgbb } from "@/lib/imgbb";
import { AMENITIES, CATEGORIES } from "@/lib/constants";
import StudioImage from "../StudioImage";

const EMPTY = {
  title: "",
  category: CATEGORIES[0],
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  galleryText: "",
  amenities: [],
  overview: "",
};

function fromStudio(s) {
  return {
    title: s.title,
    category: s.category,
    hourlyRate: String(s.hourlyRate),
    securityDeposit: String(s.securityDeposit ?? 0),
    maxCapacity: String(s.maxCapacity),
    location: s.location,
    image: s.image,
    galleryText: (s.gallery || []).join("\n"),
    amenities: s.amenities || [],
    overview: s.overview,
  };
}

function validate(f) {
  if (f.title.trim().length < 3) return "Title must be at least 3 characters.";
  if (!(Number(f.hourlyRate) >= 1)) return "Hourly rate must be at least $1.";
  if (f.securityDeposit !== "" && !(Number(f.securityDeposit) >= 0)) return "Security deposit can't be negative.";
  if (!Number.isInteger(Number(f.maxCapacity)) || Number(f.maxCapacity) < 1) return "Max capacity must be a whole number of 1 or more.";
  if (f.location.trim().length < 3) return "Location is required.";
  if (!/^https?:\/\/.+/i.test(f.image.trim())) return "Add a cover image (upload or paste a URL).";
  if (f.overview.trim().length < 20) return "Overview must be at least 20 characters.";
  return "";
}

/** Shared form for /add-studio (create) and /studios/edit/[id] (update). */
export default function StudioForm({ user, studio }) {
  const router = useRouter();
  const editing = Boolean(studio);
  const [f, setF] = useState(() => (studio ? fromStudio(studio) : EMPTY));
  const [custom, setCustom] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const allAmenities = [...new Set([...AMENITIES, ...f.amenities])];
  const toggleAmenity = (a) => setF((p) => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a] }));

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setF((p) => ({ ...p, image: url }));
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(e) {
    e.preventDefault();
    const problem = validate(f);
    if (problem) return toast.error(problem);
    const body = {
      title: f.title.trim(),
      category: f.category,
      hourlyRate: Number(f.hourlyRate),
      securityDeposit: Number(f.securityDeposit || 0),
      maxCapacity: Number(f.maxCapacity),
      location: f.location.trim(),
      image: f.image.trim(),
      gallery: f.galleryText.split(/\s*\n\s*|\s*,\s*/).filter(Boolean),
      amenities: f.amenities,
      overview: f.overview.trim(),
    };
    setBusy(true);
    try {
      if (editing) {
        await api(`/studios/${studio._id}`, { method: "PATCH", body });
        toast.success("Studio updated.");
      } else {
        await api("/studios", { method: "POST", body });
        toast.success("Studio published. It's live on Explore Studios.");
      }
      router.push("/my-listings");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <form onSubmit={submit} noValidate className="flex min-w-0 flex-[999_1_480px] flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <div className="eyebrow">{editing ? "Update studio" : "Add new studio"}</div>
          <h1 className="font-display text-[clamp(34px,4vw,44px)] font-bold tracking-[-0.03em]">{editing ? "Update your studio" : "List a new studio"}</h1>
          <p className="text-mu">
            {editing ? "Change any detail below. Host info stays tied to your account." : "Fill in the details creators look for. You can edit them any time."}
          </p>
        </div>

        <fieldset className="grid grid-cols-1 gap-4 rounded-[22px] border border-ln p-6 sm:grid-cols-2">
          <legend className="px-2 font-semibold">Basics</legend>
          <label className="label-ss sm:col-span-2">
            Studio title
            <input value={f.title} onChange={set("title")} maxLength={80} placeholder="e.g. Northlight Cyc Studio" className="field" />
          </label>
          <label className="label-ss">
            Category
            <select value={f.category} onChange={set("category")} className="field cursor-pointer">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="label-ss">
            Max capacity
            <input type="number" min="1" step="1" value={f.maxCapacity} onChange={set("maxCapacity")} placeholder="People" className="field" />
          </label>
          <label className="label-ss">
            Hourly rate ($)
            <input type="number" min="1" step="0.01" value={f.hourlyRate} onChange={set("hourlyRate")} placeholder="65" className="field" />
          </label>
          <label className="label-ss">
            Security deposit ($)
            <input type="number" min="0" step="0.01" value={f.securityDeposit} onChange={set("securityDeposit")} placeholder="150" className="field" />
          </label>
          <label className="label-ss sm:col-span-2">
            Location / address
            <input value={f.location} onChange={set("location")} placeholder="Street, city" className="field" />
          </label>
        </fieldset>

        <fieldset className="flex flex-col gap-3.5 rounded-[22px] border border-ln p-6">
          <legend className="px-2 font-semibold">Cover image</legend>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-[1.5px] border-dashed border-ln p-7 text-center hover:border-acc"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-sf2 text-acct">
              {uploading ? <span className="loading loading-spinner" /> : <Upload size={22} />}
            </span>
            <span className="font-semibold">{uploading ? "Uploading…" : "Click to upload a photo"}</span>
            <span className="text-sm text-mu">JPG or PNG, uploaded to imgbb, up to 5 MB</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <label className="label-ss">
            Image URL
            <input type="url" value={f.image} onChange={set("image")} placeholder="https://i.ibb.co/…" className="field" />
          </label>
          <label className="label-ss">
            More gallery image URLs (optional, one per line)
            <textarea rows={3} value={f.galleryText} onChange={set("galleryText")} placeholder={"https://…\nhttps://…"} className="field-area" />
          </label>
        </fieldset>

        <fieldset className="flex flex-col gap-3.5 rounded-[22px] border border-ln p-6">
          <legend className="px-2 font-semibold">Amenities</legend>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((a) => {
              const on = f.amenities.includes(a);
              return (
                <label key={a} className={`chip ${on ? "border-acc bg-acc font-semibold text-on hover:border-acc" : ""}`}>
                  <input type="checkbox" checked={on} onChange={() => toggleAmenity(a)} className="sr-only" />
                  {on ? <Check size={15} className="mr-1.5" /> : <Plus size={15} className="mr-1.5" />}
                  {a}
                </label>
              );
            })}
          </div>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="custom-amenity">
              Add your own amenity
            </label>
            <input
              id="custom-amenity"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (custom.trim()) {
                    setF((p) => ({ ...p, amenities: [...new Set([...p.amenities, custom.trim()])] }));
                    setCustom("");
                  }
                }
              }}
              placeholder="Add your own, e.g. Rooftop access"
              className="field h-11 flex-1"
            />
            <button
              type="button"
              onClick={() => {
                if (!custom.trim()) return;
                setF((p) => ({ ...p, amenities: [...new Set([...p.amenities, custom.trim()])] }));
                setCustom("");
              }}
              className="btn-line h-11"
            >
              Add
            </button>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3.5 rounded-[22px] border border-ln p-6">
          <legend className="px-2 font-semibold">Detailed overview</legend>
          <label className="label-ss">
            Describe the space, gear and house rules
            <textarea
              rows={6}
              value={f.overview}
              onChange={set("overview")}
              placeholder="Size, lighting, gear included, load-in, what is and isn't allowed"
              className="field-area"
            />
          </label>
        </fieldset>

        <fieldset className="grid grid-cols-1 gap-4 rounded-[22px] border border-ln p-6 sm:grid-cols-2">
          <legend className="px-2 font-semibold">Host (from your account)</legend>
          <label className="label-ss">
            Host name
            <input value={studio?.ownerName || user.name} readOnly className="field cursor-not-allowed bg-sf2 text-mu" />
          </label>
          <label className="label-ss">
            Host email
            <input value={studio?.ownerEmail || user.email} readOnly className="field cursor-not-allowed bg-sf2 text-mu" />
          </label>
        </fieldset>

        <div className="flex flex-wrap justify-end gap-3">
          <Link href="/my-listings" className="btn-line h-[52px]">
            Cancel
          </Link>
          <button type="submit" disabled={busy || uploading} className="btn-main h-[52px] px-[26px] text-base">
            {busy && <span className="loading loading-spinner loading-sm" />}
            {editing ? "Save changes" : "Publish studio"}
          </button>
        </div>
      </form>

      <aside aria-label="Listing preview" className="flex flex-[1_1_300px] flex-col gap-3 lg:sticky lg:top-24">
        <div className="font-mono text-xs text-mu">LIVE CARD PREVIEW</div>
        <article className="card-ss overflow-hidden">
          <div className="relative aspect-[4/3]">
            <StudioImage key={f.image} src={f.image} alt="Cover image preview" className="h-full w-full" label="Cover image" />
            <span className="absolute top-3.5 left-3.5 rounded-full border border-ln bg-bg px-2.5 py-1.5 text-xs font-semibold">{f.category}</span>
          </div>
          <div className="flex flex-col gap-2.5 p-5">
            <div className="font-display text-[21px] font-bold">{f.title || "Your studio title"}</div>
            <div className="text-sm text-mu">{f.location || "Location"}</div>
            <div className="border-t border-ln pt-3">
              <span className="font-display text-2xl font-bold">${f.hourlyRate || "—"}</span>
              <span className="text-sm text-mu"> / hr</span>
            </div>
          </div>
        </article>
      </aside>
    </div>
  );
}
