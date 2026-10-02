import { useEffect, useState } from "react";
import { Tag, Plus } from "lucide-react";
import { categoryApi } from "../../api/courses";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import { TextInput } from "../../components/FormField";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/errorMessage";

export default function CategoryManagementPage() {
  const { push } = useToast();
  const [categories, setCategories] = useState(null);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const load = () => categoryApi.list().then((res) => setCategories(res.data)).catch(() => setCategories([]));
  useEffect(load, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await categoryApi.create(name.trim());
      setName("");
      push("Category created.", "success");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not create category."), "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Categories</h1>

      <form onSubmit={create} className="mt-6 flex gap-2">
        <TextInput placeholder="e.g. Data Science" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit" loading={creating}>
          <Plus size={15} /> Add
        </Button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories === null ? (
          <div className="flex justify-center py-10 w-full"><Spinner size={24} /></div>
        ) : (
          categories.map((c) => (
            <span key={c.id} className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-sm">
              <Tag size={13} className="text-[var(--color-violet)]" /> {c.name}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
