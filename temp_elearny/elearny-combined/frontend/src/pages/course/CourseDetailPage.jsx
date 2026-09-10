import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, PlayCircle, FileText, HelpCircle, ClipboardList, Heart } from "lucide-react";
import { courseApi } from "../../api/courses";
import { enrollmentApi, paymentApi } from "../../api/enrollment";
import { wishlistApi } from "../../api/wishlist";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import StarRatingInput from "../../components/StarRatingInput";
import { getErrorMessage } from "../../utils/errorMessage";

const CONTENT_ICON = { VIDEO: PlayCircle, DOCUMENT: FileText, QUIZ: HelpCircle, ASSIGNMENT: ClipboardList };

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  useEffect(() => {
    courseApi.get(id).then((res) => setCourse(res.data));
    courseApi.reviews(id).then((res) => setReviews(res.data)).catch(() => setReviews([]));
    if (user?.role === "STUDENT") {
      enrollmentApi
        .myEnrollments()
        .then((res) => setAlreadyEnrolled(res.data.some((e) => e.course?.id === Number(id))))
        .catch(() => {});
    }
  }, [id, user]);

  if (!course) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={28} />
      </div>
    );
  }

  const isFree = !course.price || Number(course.price) === 0;

  const handleEnroll = async () => {
    if (!user) return navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
    setEnrolling(true);
    try {
      if (isFree) {
        await enrollmentApi.enrollFree(id);
        push("Enrolled! Let's start learning.", "success");
        navigate(`/learn/${id}`);
      } else {
        const { data } = await paymentApi.initiate(id);
        push(
          `Order created (${data.razorpayOrderId}) for ₹${(data.amountInPaise / 100).toFixed(2)}. ` +
          `Payment checkout isn't fully wired up in this build yet — the order exists on the ` +
          `Razorpay side, but there's no card-entry step to complete it from here.`,
          "info"
        );
      }
    } catch (err) {
      push(getErrorMessage(err, "Could not enroll in this course."), "error");
    } finally {
      setEnrolling(false);
    }
  };

  const addToWishlist = async () => {
    if (!user) return navigate("/login");
    try {
      await wishlistApi.add(id);
      push("Added to wishlist", "success");
    } catch {
      push("Could not add to wishlist", "error");
    }
  };

  return (
    <div>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-ink)] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px]">
          <div>
            {course.categoryName && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {course.categoryName}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-white/70">{course.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Star size={15} className="fill-[var(--color-warn)] text-[var(--color-warn)]" />
                <span className="font-mono-stat font-semibold">{course.averageRating?.toFixed(1) ?? "New"}</span>
                <span className="text-white/60">({course.reviewCount ?? 0} ratings)</span>
              </span>
              <span className="text-white/60">Taught by {course.instructorName}</span>
              {course.level && <span className="text-white/60">Level: {course.level}</span>}
            </div>
            {course.prerequisiteCourseId && (
              <p className="mt-3 text-sm text-white/60">
                Prerequisite: complete{" "}
                <Link to={`/courses/${course.prerequisiteCourseId}`} className="underline">
                  the prerequisite course
                </Link>{" "}
                first.
              </p>
            )}
          </div>

          <PurchaseCard
            course={course}
            isFree={isFree}
            alreadyEnrolled={alreadyEnrolled}
            enrolling={enrolling}
            onEnroll={handleEnroll}
            onWishlist={addToWishlist}
            viewerRole={user?.role}
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-xl font-bold">Curriculum</h2>
        <div className="mt-6 divide-y divide-[var(--color-line)] rounded-2xl border border-[var(--color-line)] bg-white">
          {course.sections?.map((section) => (
            <div key={section.id} className="p-5">
              <h3 className="font-display text-sm font-semibold">{section.title}</h3>
              <div className="mt-3 flex flex-col">
                {section.subsections?.map((sub) => {
                  const Icon = CONTENT_ICON[sub.contentType] || FileText;
                  return (
                    <div key={sub.id} className="spine-node flex items-center gap-3 py-2 pl-1">
                      <Icon size={18} className="shrink-0 text-[var(--color-violet)]" />
                      <span className="text-sm text-[var(--color-ink)]">{sub.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )) ?? <p className="p-5 text-sm text-[var(--color-ink-soft)]">Curriculum coming soon.</p>}
        </div>

        <h2 className="mt-14 font-display text-xl font-bold">Reviews</h2>
        <ReviewsSection courseId={id} reviews={reviews} setReviews={setReviews} alreadyEnrolled={alreadyEnrolled} />
      </section>
    </div>
  );
}

function PurchaseCard({ course, isFree, alreadyEnrolled, enrolling, onEnroll, onWishlist, viewerRole }) {
  // Enrollment and wishlist are Student-only on the backend (@PreAuthorize("hasRole('STUDENT')")) —
  // an Instructor/TA/Admin viewing a course (e.g. previewing another instructor's course) would
  // otherwise see buttons that always fail with a confusing 403. Not-logged-in visitors still see
  // the normal buttons, since clicking them sends them to log in first (handleEnroll/addToWishlist
  // both check `if (!user)` before doing anything else).
  const isNonStudentAccount = viewerRole && viewerRole !== "STUDENT";

  return (
    <div className="h-fit rounded-2xl border border-[var(--color-line)] bg-white p-5 text-[var(--color-ink)] shadow-xl">
      <div className="aspect-video w-full rounded-xl bg-[var(--color-violet-pale)]" />
      <p className="mt-4 font-mono-stat text-2xl font-extrabold">{isFree ? "Free" : `₹${course.price}`}</p>
      {isNonStudentAccount ? (
        <p className="mt-4 rounded-xl bg-[var(--color-canvas)] p-3 text-center text-xs text-[var(--color-ink-soft)]">
          Enrollment is only available on Student accounts.
        </p>
      ) : alreadyEnrolled ? (
        <Link to={`/learn/${course.id}`}>
          <Button className="mt-4 w-full">Go to course</Button>
        </Link>
      ) : (
        <>
          <Button onClick={onEnroll} loading={enrolling} className="mt-4 w-full">
            {isFree ? "Enroll for free" : "Buy now"}
          </Button>
          <Button variant="outline" onClick={onWishlist} className="mt-2 w-full">
            <Heart size={15} /> Add to wishlist
          </Button>
        </>
      )}
    </div>
  );
}

function ReviewsSection({ courseId, reviews, setReviews, alreadyEnrolled }) {
  const { push } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!rating) return push("Pick a star rating first.", "error");
    setSubmitting(true);
    try {
      const { data } = await courseApi.addReview(courseId, { rating, comment });
      setReviews((r) => [data, ...r]);
      setComment("");
      setRating(0);
      push("Review posted", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not post review."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      {alreadyEnrolled && (
        <div className="mb-8 rounded-2xl border border-[var(--color-line)] bg-white p-5">
          <p className="text-sm font-semibold">Leave a review</p>
          <div className="mt-2">
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think of this course?"
            rows={3}
            className="mt-3 w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-violet)]"
          />
          <Button onClick={submit} loading={submitting} className="mt-3">
            Post review
          </Button>
        </div>
      )}
      <div className="flex flex-col divide-y divide-[var(--color-line)]">
        {reviews.length === 0 && <p className="py-4 text-sm text-[var(--color-ink-soft)]">No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{r.studentName}</span>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className={i < r.rating ? "fill-[var(--color-warn)] text-[var(--color-warn)]" : "text-[var(--color-line)]"} />
                ))}
              </span>
            </div>
            {r.comment && <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
