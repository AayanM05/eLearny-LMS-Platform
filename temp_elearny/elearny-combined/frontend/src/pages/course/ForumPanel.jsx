import { useEffect, useState } from "react";
import { ArrowUp, Send } from "lucide-react";
import { forumApi } from "../../api/forum";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import { TextArea } from "../../components/FormField";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { getErrorMessage } from "../../utils/errorMessage";

export default function ForumPanel({ subsectionId }) {
  const { push } = useToast();
  const [threads, setThreads] = useState(null);
  const [question, setQuestion] = useState("");
  const [posting, setPosting] = useState(false);

  const load = () => forumApi.list(subsectionId).then((res) => setThreads(res.data)).catch(() => setThreads([]));

  useEffect(() => {
    setThreads(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subsectionId]);

  const postThread = async () => {
    if (!question.trim()) return;
    setPosting(true);
    try {
      await forumApi.createThread(subsectionId, question.trim());
      setQuestion("");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not post your question."), "error");
    } finally {
      setPosting(false);
    }
  };

  if (threads === null) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <p className="mb-2 text-sm font-semibold">Ask a question</p>
        <TextArea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Stuck on something in this lesson? Ask here."
        />
        <Button onClick={postThread} loading={posting} className="mt-3">
          <Send size={14} /> Post
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {threads.length === 0 && (
          <EmptyState title="No questions yet" description="Be the first to ask about this lesson." />
        )}
        {threads.map((t) => (
          <ThreadCard key={t.id} thread={t} onChanged={load} />
        ))}
      </div>
    </div>
  );
}

function ThreadCard({ thread, onChanged }) {
  const { push } = useToast();
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const upvote = async () => {
    try {
      await forumApi.upvote(thread.id);
      onChanged();
    } catch {
      push("Could not upvote.", "error");
    }
  };

  const reply = async () => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await forumApi.reply(thread.id, replyText.trim());
      setReplyText("");
      setShowReply(false);
      onChanged();
    } catch (err) {
      push(getErrorMessage(err, "Could not post reply."), "error");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
      <div className="flex items-start gap-3">
        <button onClick={upvote} className="flex flex-col items-center rounded-lg border border-[var(--color-line)] px-2 py-1 hover:border-[var(--color-violet)]">
          <ArrowUp size={14} />
          <span className="font-mono-stat text-xs font-semibold">{thread.upvotes}</span>
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold">{thread.studentName}</p>
          <p className="mt-1 text-sm">{thread.questionText}</p>

          <div className="mt-3 flex flex-col gap-2 border-l-2 border-[var(--color-line)] pl-3">
            {thread.replies?.map((r) => (
              <div key={r.id}>
                <p className="text-xs font-semibold text-[var(--color-violet-deep)]">{r.authorName}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">{r.replyText}</p>
              </div>
            ))}
          </div>

          {showReply ? (
            <div className="mt-3 flex gap-2">
              <TextArea rows={1} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." />
              <Button variant="outline" onClick={reply} loading={replying}>Reply</Button>
            </div>
          ) : (
            <button onClick={() => setShowReply(true)} className="mt-2 text-xs font-semibold text-[var(--color-violet)] hover:underline">
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
