import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { wishlistApi } from "../../api/wishlist";
import CourseCard from "../../components/CourseCard";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

export default function WishlistPage() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    wishlistApi.list().then((res) => setItems(res.data)).catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Your wishlist</h1>
      <div className="mt-8">
        {items === null ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : items.length === 0 ? (
          <EmptyState icon={Heart} title="Nothing saved yet" description="Tap the heart on any course to save it here." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((w) => <CourseCard key={w.id} course={w.course} />)}
          </div>
        )}
      </div>
    </div>
  );
}
