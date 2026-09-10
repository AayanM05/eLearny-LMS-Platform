import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PlayCircle, FileText, HelpCircle, ClipboardList, CheckCircle2, Circle, MessageSquare, Video } from "lucide-react";
import { courseApi } from "../../api/courses";
import { enrollmentApi } from "../../api/enrollment";
import { useToast } from "../../components/Toast";
import Spinner from "../../components/Spinner";
import ProgressRing from "../../components/ProgressRing";
import QuizPlayer from "./QuizPlayer";
import AssignmentPanel from "./AssignmentPanel";
import ForumPanel from "./ForumPanel";
import LiveSessionsPanel from "./LiveSessionsPanel";
import { getErrorMessage } from "../../utils/errorMessage";

const CONTENT_ICON = { VIDEO: PlayCircle, DOCUMENT: FileText, QUIZ: HelpCircle, ASSIGNMENT: ClipboardList };

export default function CoursePlayerPage() {
  const { courseId } = useParams();
  const { push } = useToast();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [showForum, setShowForum] = useState(false);
  const [showLiveSessions, setShowLiveSessions] = useState(false);

  useEffect(() => {
    courseApi.get(courseId).then((res) => {
      setCourse(res.data);
      const first = res.data.sections?.[0]?.subsections?.[0];
      if (first) setActiveId(first.id);
    });
    courseApi.progress(courseId).then((res) => setProgress(res.data)).catch(() => {});
  }, [courseId]);

  const flatSubsections = useMemo(
    () => course?.sections?.flatMap((s) => s.subsections ?? []) ?? [],
    [course]
  );
  const active = flatSubsections.find((s) => s.id === activeId);

  const markComplete = async (subsectionId) => {
    try {
      await enrollmentApi.markSubsectionComplete(subsectionId);
      setCompletedIds((prev) => new Set(prev).add(subsectionId));
      const res = await courseApi.progress(courseId);
      setProgress(res.data);
      if (res.data.percent >= 100) {
        push("Course complete! Your certificate is being generated.", "success");
      } else {
        // Auto-advance to the next lesson, mirroring how a course is meant to be worked through
        // top to bottom — the same "finish the whole thing" idea the product leads with. Only
        // applies to video/document lessons (the only content types with a manual "mark complete"
        // button); quizzes and assignments complete themselves via their own flows.
        const currentIndex = flatSubsections.findIndex((s) => s.id === subsectionId);
        const next = flatSubsections[currentIndex + 1];
        if (next) setActiveId(next.id);
      }
    } catch (err) {
      push(getErrorMessage(err, "Could not update progress."), "error");
    }
  };

  if (!course) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-[320px_1fr]">
      {/* Sidebar: the learning-path spine — a vertical progress line through every subsection */}
      <aside className="border-r border-[var(--color-line)] bg-white lg:h-[calc(100vh-64px)] lg:overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-[var(--color-line)] p-4">
          <ProgressRing percent={progress?.percent ?? 0} size={44} stroke={4} />
          <div>
            <p className="font-display text-sm font-semibold leading-tight">{course.title}</p>
            <p className="text-xs text-[var(--color-ink-soft)]">
              {progress ? `${progress.completed} of ${progress.total} complete` : "Loading progress..."}
            </p>
          </div>
        </div>
        <div className="p-4">
          {course.sections?.map((section) => (
            <div key={section.id} className="mb-5">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">
                {section.title}
              </h4>
              {section.subsections?.map((sub) => {
                const Icon = CONTENT_ICON[sub.contentType] || FileText;
                const isDone = sub.completed || completedIds.has(sub.id);
                const isActive = sub.id === activeId;
                return (
                  <button
                    key={sub.id}
                    onClick={() => { setActiveId(sub.id); setShowForum(false); setShowLiveSessions(false); }}
                    className={`spine-node flex w-full items-center gap-3 rounded-lg py-2 pl-1 pr-2 text-left text-sm transition ${
                      isActive ? "bg-[var(--color-violet-pale)] text-[var(--color-violet-deep)] font-semibold" : "hover:bg-[var(--color-canvas)]"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} className="shrink-0 text-[var(--color-success)]" />
                    ) : (
                      <Icon size={18} className="shrink-0 text-[var(--color-ink-soft)]" />
                    )}
                    <span className="truncate">{sub.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Content area */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4">
          <h2 className="font-display text-lg font-semibold">{active?.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowLiveSessions((v) => !v); setShowForum(false); }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${showLiveSessions ? "border-[var(--color-violet)] text-[var(--color-violet)]" : "border-[var(--color-line)] hover:border-[var(--color-violet)]"}`}
            >
              <Video size={14} /> Live sessions
            </button>
            <button
              onClick={() => { setShowForum((v) => !v); setShowLiveSessions(false); }}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${showForum ? "border-[var(--color-violet)] text-[var(--color-violet)]" : "border-[var(--color-line)] hover:border-[var(--color-violet)]"}`}
            >
              <MessageSquare size={14} /> Discussion
            </button>
          </div>
        </div>

        <div className="flex-1 p-6">
          {showLiveSessions ? (
            <LiveSessionsPanel courseId={courseId} />
          ) : showForum && active ? (
            <ForumPanel subsectionId={active.id} />
          ) : (
            <SubsectionContent
              subsection={active}
              onMarkComplete={() => markComplete(active.id)}
              isDone={active?.completed || completedIds.has(active?.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SubsectionContent({ subsection, onMarkComplete, isDone }) {
  if (!subsection) return null;

  if (subsection.contentType === "VIDEO") {
    return (
      <div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          {subsection.contentUrl ? (
            <video src={subsection.contentUrl} controls className="h-full w-full" />
          ) : (
            <div className="flex h-full items-center justify-center text-white/50">Video not available</div>
          )}
        </div>
        <MarkCompleteBar isDone={isDone} onMarkComplete={onMarkComplete} />
      </div>
    );
  }

  if (subsection.contentType === "DOCUMENT") {
    return (
      <div>
        <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
          {subsection.contentUrl ? (
            <a href={subsection.contentUrl} target="_blank" rel="noreferrer" className="text-[var(--color-violet)] underline">
              Open document
            </a>
          ) : (
            <p className="text-sm text-[var(--color-ink-soft)]">Document not available.</p>
          )}
        </div>
        <MarkCompleteBar isDone={isDone} onMarkComplete={onMarkComplete} />
      </div>
    );
  }

  if (subsection.contentType === "QUIZ") {
    return <QuizPlayer subsectionId={subsection.id} />;
  }

  if (subsection.contentType === "ASSIGNMENT") {
    return <AssignmentPanel subsectionId={subsection.id} />;
  }

  return null;
}

function MarkCompleteBar({ isDone, onMarkComplete }) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <button
        onClick={onMarkComplete}
        disabled={isDone}
        className="flex items-center gap-2 rounded-full bg-[var(--color-violet)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-violet-deep)] disabled:cursor-default disabled:bg-[var(--color-success)]"
      >
        {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
        {isDone ? "Completed" : "Mark as complete"}
      </button>
    </div>
  );
}
