"use client";
import Money from "@/components/Money";
import { useUIStore } from "@/store/useUIStore";

type Props = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
};

export default function DishCard({ id, name, description, imageUrl, price }: Props) {
  const openDish = useUIStore((s) => s.openDish);
  return (
    <button
      onClick={() => { console.log('DishCard click', id); openDish(id); }}
      className="flex h-full flex-col rounded-lg border bg-white text-left transition hover:shadow-md"
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-40 w-full rounded-t-lg object-cover" />
      ) : (
        <div className="h-40 w-full rounded-t-lg bg-zinc-100" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <h3 className="line-clamp-1 font-medium text-zinc-900">{name}</h3>
          <span className="shrink-0 text-sm font-semibold text-zinc-900">
            <Money amount={price} />
          </span>
        </div>
        {description && <p className="line-clamp-2 text-sm text-zinc-600">{description}</p>}
      </div>
    </button>
  );
}


