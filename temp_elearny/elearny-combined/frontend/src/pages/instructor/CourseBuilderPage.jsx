import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Plus, Eye, EyeOff, Users, Video, FileSpreadsheet } from "lucide-react";
import { courseApi, categoryApi } from "../../api/courses";
import { quizApi, assignmentApi } from "../../api/quizzes";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import FormField, { TextInput, TextArea, Select } from "../../components/FormField";
import AssignmentGradingBySubsection from "../../components/AssignmentGradingBySubsection";
import { getErrorMessage } from "../../utils/errorMessage";

const CONTENT_TYPES = ["VIDEO", "DOCUMENT", "QUIZ", "ASSIGNMENT"];

export default function CourseBuilderPage() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { push } = useToast();

  const [categories, setCategories] = useState([]);
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", price: 0, level: "BEGINNER", categoryId: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryApi.list().then((res) => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isNew) {
      courseApi.get(id).then((res) => {
        setCourse(res.data);
        setForm({
          title: res.data.title, description: res.data.description || "",
          price: res.data.price, level: res.data.level || "BEGINNER", categoryId: "",
        });
      });
    }
  }, [id, isNew]);

  const saveMeta = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), categoryId: form.categoryId || null };
      if (isNew) {
        const { data } = await courseApi.create(payload);
        push("Course created — now build the curriculum.", "success");
        navigate(`/instructor/courses/${data.id}`, { replace: true });
      } else {
        const { data } = await courseApi.update(id, payload);
        setCourse(data);
        push("Course details saved.", "success");
      }
    } catch (err) {
      push(getErrorMessage(err, "Could not save course."), "error");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    try {
      if (course.published) {
        await courseApi.unpublish(id);
        push("Course unpublished.", "info");
      } else {
        await courseApi.publish(id);
        push("Course published!", "success");
      }
      const { data } = await courseApi.get(id);
      setCourse(data);
    } catch (err) {
      push(getErrorMessage(err, "Could not update publish state."), "error");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">{isNew ? "Create a course" : "Edit course"}</h1>

      {!isNew && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/instructor/courses/${id}/tas`} className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold hover:border-[var(--color-violet)]">
            <Users size={14} /> Teaching assistants
          </Link>
          <Link to={`/instructor/courses/${id}/live-sessions`} className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold hover:border-[var(--color-violet)]">
            <Video size={14} /> Live sessions
          </Link>
          <Link to={`/instructor/courses/${id}/reports`} className="flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold hover:border-[var(--color-violet)]">
            <FileSpreadsheet size={14} /> Reports
          </Link>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-6">
        <FormField label="Title">
          <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </FormField>
        <FormField label="Description">
          <TextArea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Price (₹, 0 = free)">
            <TextInput type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </FormField>
          <FormField label="Level">
            <Select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </Select>
          </FormField>
        </div>
        <FormField label="Category">
          <Select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FormField>
        <div className="flex gap-3">
          <Button onClick={saveMeta} loading={saving}>
            {isNew ? "Create course" : "Save changes"}
          </Button>
          {!isNew && (
            <Button variant="outline" onClick={togglePublish}>
              {course?.published ? <EyeOff size={15} /> : <Eye size={15} />}
              {course?.published ? "Unpublish" : "Publish"}
            </Button>
          )}
        </div>
      </div>

      {!isNew && course && <CurriculumBuilder courseId={id} course={course} onRefresh={async () => setCourse((await courseApi.get(id)).data)} />}
    </div>
  );
}

function CurriculumBuilder({ courseId, course, onRefresh }) {
  const { push } = useToast();
  const [sectionTitle, setSectionTitle] = useState("");
  const [addingSection, setAddingSection] = useState(false);

  const addSection = async () => {
    if (!sectionTitle.trim()) return;
    setAddingSection(true);
    try {
      const order = (course.sections?.length ?? 0) + 1;
      await courseApi.addSection(courseId, { title: sectionTitle.trim(), order });
      setSectionTitle("");
      onRefresh();
    } catch (err) {
      push(getErrorMessage(err, "Could not add section."), "error");
    } finally {
      setAddingSection(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-bold">Curriculum</h2>

      <div className="mt-4 flex flex-col gap-4">
        {course.sections?.map((section) => (
          <SectionEditor key={section.id} section={section} onRefresh={onRefresh} />
        ))}
      </div>

      <div className="mt-5 flex gap-2 rounded-2xl border border-dashed border-[var(--color-line)] p-4">
        <TextInput placeholder="New section title" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} />
        <Button onClick={addSection} loading={addingSection} variant="outline">
          <Plus size={15} /> Add section
        </Button>
      </div>
    </div>
  );
}

function SectionEditor({ section, onRefresh }) {
  const { push } = useToast();
  const [subTitle, setSubTitle] = useState("");
  const [contentType, setContentType] = useState("VIDEO");
  const [contentUrl, setContentUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const addSubsection = async () => {
    if (!subTitle.trim()) return;
    setAdding(true);
    try {
      const order = (section.subsections?.length ?? 0) + 1;
      const { data } = await courseApi.addSubsection(section.id, {
        title: subTitle.trim(), contentType, contentUrl: contentUrl.trim() || null, order,
      });
      if (contentType === "QUIZ") {
        push("Sub-section added. Open it below to configure quiz questions.", "info");
      } else if (contentType === "ASSIGNMENT") {
        push("Sub-section added. Open it below to configure assignment instructions.", "info");
      }
      setSubTitle("");
      setContentUrl("");
      onRefresh();
      return data;
    } catch (err) {
      push(getErrorMessage(err, "Could not add sub-section."), "error");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
      <h3 className="font-display text-sm font-semibold">{section.title}</h3>
      <div className="mt-3 flex flex-col gap-2">
        {section.subsections?.map((sub) => (
          <SubsectionRow key={sub.id} subsection={sub} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--color-line)] pt-4">
        <TextInput placeholder="Lesson title" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} className="w-40" />
        <Select value={contentType} onChange={(e) => setContentType(e.target.value)} className="w-36">
          {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        {(contentType === "VIDEO" || contentType === "DOCUMENT") && (
          <TextInput placeholder="Content URL" value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} className="w-48" />
        )}
        <Button variant="outline" onClick={addSubsection} loading={adding}>
          <Plus size={14} /> Add lesson
        </Button>
      </div>
    </div>
  );
}

function SubsectionRow({ subsection }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState("edit"); // "edit" | "grade" — only relevant for ASSIGNMENT
  return (
    <div className="rounded-xl border border-[var(--color-line)] px-3.5 py-2.5">
      <button className="flex w-full items-center justify-between text-left text-sm" onClick={() => setExpanded((v) => !v)}>
        <span>{subsection.title}</span>
        <span className="rounded-full bg-[var(--color-violet-pale)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-violet-deep)]">
          {subsection.contentType}
        </span>
      </button>
      {expanded && (subsection.contentType === "QUIZ" || subsection.contentType === "ASSIGNMENT") && (
        <div className="mt-3 border-t border-[var(--color-line)] pt-3">
          {subsection.contentType === "QUIZ" ? (
            <QuizBuilder subsectionId={subsection.id} />
          ) : (
            <>
              <div className="mb-3 flex gap-2">
                <button
                  onClick={() => setTab("edit")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${tab === "edit" ? "bg-[var(--color-violet)] text-white" : "border border-[var(--color-line)]"}`}
                >
                  Edit assignment
                </button>
                <button
                  onClick={() => setTab("grade")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${tab === "grade" ? "bg-[var(--color-violet)] text-white" : "border border-[var(--color-line)]"}`}
                >
                  Grade submissions
                </button>
              </div>
              {tab === "edit" ? (
                <AssignmentBuilder subsectionId={subsection.id} />
              ) : (
                <AssignmentGradingBySubsection subsectionId={subsection.id} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function QuizBuilder({ subsectionId }) {
  const { push } = useToast();
  const [threshold, setThreshold] = useState(70);
  const [questions, setQuestions] = useState([{ questionText: "", options: ["", ""], correctOption: "" }]);
  const [saving, setSaving] = useState(false);

  const updateQuestion = (i, patch) => setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const addQuestion = () => setQuestions((qs) => [...qs, { questionText: "", options: ["", ""], correctOption: "" }]);
  const addOption = (i) => updateQuestion(i, { options: [...questions[i].options, ""] });

  const save = async () => {
    const nonEmptyQuestions = questions.filter((q) => q.questionText.trim());
    if (nonEmptyQuestions.length === 0) {
      return push("Add at least one question before saving.", "error");
    }
    for (let i = 0; i < nonEmptyQuestions.length; i++) {
      const q = nonEmptyQuestions[i];
      const nonEmptyOptions = q.options.filter((o) => o.trim());
      if (nonEmptyOptions.length < 2) {
        return push(`Question ${i + 1} needs at least 2 answer options.`, "error");
      }
      if (!q.correctOption.trim() || !nonEmptyOptions.includes(q.correctOption)) {
        return push(`Question ${i + 1} needs a correct answer selected (click the circle next to it).`, "error");
      }
    }
    setSaving(true);
    try {
      await quizApi.create(subsectionId, {
        passThresholdPercent: Number(threshold),
        allowMultipleAttempts: true,
        questions: nonEmptyQuestions,
      });
      push("Quiz saved.", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not save quiz."), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Pass threshold (%)">
        <TextInput type="number" min="1" max="100" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="w-24" />
      </FormField>
      {questions.map((q, i) => (
        <div key={i} className="rounded-lg border border-[var(--color-line)] p-3">
          <TextInput
            placeholder={`Question ${i + 1}`}
            value={q.questionText}
            onChange={(e) => updateQuestion(i, { questionText: e.target.value })}
          />
          <div className="mt-2 flex flex-col gap-1.5">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={q.correctOption === opt && opt !== ""}
                  onChange={() => updateQuestion(i, { correctOption: opt })}
                />
                <TextInput
                  placeholder={`Option ${oi + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const opts = [...q.options];
                    opts[oi] = e.target.value;
                    updateQuestion(i, { options: opts, correctOption: q.correctOption === opt ? e.target.value : q.correctOption });
                  }}
                />
              </div>
            ))}
            <button className="w-fit text-xs font-semibold text-[var(--color-violet)]" onClick={() => addOption(i)}>
              + Add option
            </button>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addQuestion} className="w-fit">
        <Plus size={14} /> Add question
      </Button>
      <Button onClick={save} loading={saving} className="w-fit">Save quiz</Button>
    </div>
  );
}

function AssignmentBuilder({ subsectionId }) {
  const { push } = useToast();
  const [instructions, setInstructions] = useState("");
  const [allowedFileTypes, setAllowedFileTypes] = useState("pdf,zip");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await assignmentApi.create(subsectionId, {
        instructions, allowedFileTypes, dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      push("Assignment saved.", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not save assignment."), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <FormField label="Instructions">
        <TextArea rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
      </FormField>
      <FormField label="Allowed file types">
        <TextInput value={allowedFileTypes} onChange={(e) => setAllowedFileTypes(e.target.value)} />
      </FormField>
      <FormField label="Due date">
        <TextInput type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </FormField>
      <Button onClick={save} loading={saving} className="w-fit">Save assignment</Button>
    </div>
  );
}
