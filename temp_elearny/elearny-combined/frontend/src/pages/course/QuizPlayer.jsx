import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { quizApi } from "../../api/quizzes";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/errorMessage";

export default function QuizPlayer({ subsectionId }) {
  const { push } = useToast();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuiz(null);
    setResult(null);
    setAnswers({});
    setError("");
    quizApi
      .getBySubsection(subsectionId)
      .then((res) => setQuiz(res.data))
      .catch((err) => setError(getErrorMessage(err, "This quiz isn't available yet.")));
  }, [subsectionId]);

  if (error) {
    return <p className="text-sm text-[var(--color-ink-soft)]">{error}</p>;
  }
  if (!quiz) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={24} />
      </div>
    );
  }

  const submit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      return push("Answer every question before submitting.", "error");
    }
    setSubmitting(true);
    try {
      const { data } = await quizApi.attempt(quiz.id, answers);
      setResult(data);
      if (data.passed) push("Nice — you passed!", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not submit quiz."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-6 text-sm text-[var(--color-ink-soft)]">
        Pass threshold: <span className="font-mono-stat font-semibold">{quiz.passThresholdPercent}%</span>
      </p>

      {result ? (
        <div
          className={`mb-6 flex items-center gap-3 rounded-2xl border p-5 ${
            result.passed ? "border-[var(--color-success)] bg-green-50" : "border-[var(--color-coral)] bg-orange-50"
          }`}
        >
          {result.passed ? (
            <CheckCircle2 size={22} className="text-[var(--color-success)]" />
          ) : (
            <XCircle size={22} className="text-[var(--color-coral-deep)]" />
          )}
          <div>
            <p className="font-semibold">{result.passed ? "You passed!" : "Not quite — try again"}</p>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Score: <span className="font-mono-stat">{result.scorePercent}%</span>
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        {quiz.questions.map((q, i) => {
          const options = safeParseOptions(q.optionsJson);
          return (
            <div key={q.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <p className="font-medium">
                {i + 1}. {q.questionText}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {options.map((opt) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition ${
                      answers[q.id] === opt
                        ? "border-[var(--color-violet)] bg-[var(--color-violet-pale)]"
                        : "border-[var(--color-line)] hover:border-[var(--color-violet)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="hidden"
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {(!result || !result.passed) && (
        <Button onClick={submit} loading={submitting} className="mt-6">
          Submit quiz
        </Button>
      )}
    </div>
  );
}

function safeParseOptions(json) {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}
