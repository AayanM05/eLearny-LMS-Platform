package com.elearny.config;

import com.elearny.entity.*;
import com.elearny.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds the in-memory H2 database with test accounts and sample content so the app is explorable
 * immediately after startup, without anyone having to manually register/approve/build a course
 * first. Only runs on the "dev" profile (H2) — never touches a real MySQL deployment, and is
 * idempotent (skips entirely if a User already exists) so it's safe even if "dev" runs twice
 * against a persistent store.
 *
 * See TESTING_GUIDE.md at the project root for the full set of accounts and what to try with them.
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final SubsectionRepository subsectionRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final ReviewRepository reviewRepository;
    private final CouponRepository couponRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRequestRepository refundRequestRepository;
    private final TaAssignmentRepository taAssignmentRepository;
    private final LiveSessionSlotRepository liveSessionSlotRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("DataSeeder: existing data found, skipping seed.");
            return;
        }
        log.info("DataSeeder: seeding test accounts and sample courses...");

        // --- Categories -------------------------------------------------------------------
        Category webDev = categoryRepository.save(Category.builder().name("Web Development").build());
        Category dataSci = categoryRepository.save(Category.builder().name("Data Science").build());
        categoryRepository.save(Category.builder().name("Design").build());

        // --- Users --------------------------------------------------------------------------
        // Admin and Instructor are seeded with totpEnabled=false on purpose: logging in as either
        // exercises the real FR59 flow (mandatory 2FA setup on first login), rather than faking it.
        User admin = userRepository.save(User.builder()
                .name("Ava Admin").email("admin@elearny.com").phone("9000000001")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN).approved(true).active(true).totpEnabled(false).build());

        User instructor = userRepository.save(User.builder()
                .name("Priya Instructor").email("instructor@elearny.com").phone("9000000002")
                .password(passwordEncoder.encode("Instructor@123"))
                .role(Role.INSTRUCTOR).approved(true).active(true).totpEnabled(false).build());

        // A second, UNAPPROVED instructor — so the Admin dashboard's approval queue isn't empty on first look.
        userRepository.save(User.builder()
                .name("Sam Pending").email("pending.instructor@elearny.com").phone("9000000003")
                .password(passwordEncoder.encode("Instructor@123"))
                .role(Role.INSTRUCTOR).approved(false).active(true).totpEnabled(false).build());

        User student1 = userRepository.save(User.builder()
                .name("Rahul Student").email("student@elearny.com").phone("9000000004")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT).approved(true).active(true).totpEnabled(false).build());

        User student2 = userRepository.save(User.builder()
                .name("Meera Student").email("student2@elearny.com").phone("9000000005")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT).approved(true).active(true).totpEnabled(false).build());

        // TA accounts are never self-registered (AuthService blocks it) — seeded directly here,
        // the same way a real one would exist only via an instructor's invitation being accepted once.
        User ta = userRepository.save(User.builder()
                .name("Tara Assistant").email("ta@elearny.com").phone("9000000006")
                .password(passwordEncoder.encode("Ta@12345"))
                .role(Role.TEACHING_ASSISTANT).approved(true).active(true).totpEnabled(false).build());

        // --- Course A: free, published, has quiz + assignment + a completed lesson for student1 ---
        Course courseA = courseRepository.save(Course.builder()
                .title("Complete Web Development Bootcamp")
                .description("HTML, CSS, JavaScript, and a real deployed project — from zero to your first live site.")
                .level(CourseLevel.BEGINNER).price(BigDecimal.ZERO)
                .instructor(instructor).category(webDev)
                .active(true).published(true).isCohortBased(false).build());

        Section a1 = sectionRepository.save(Section.builder().title("Getting Started").order(1).course(courseA).build());
        Subsection a1v = subsectionRepository.save(Subsection.builder()
                .title("Welcome & Setup").contentType(ContentType.VIDEO)
                .contentUrl("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4")
                .order(1).section(a1).build());
        Subsection a1d = subsectionRepository.save(Subsection.builder()
                .title("Course Handbook (PDF)").contentType(ContentType.DOCUMENT)
                .contentUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                .order(2).section(a1).build());
        Subsection a1q = subsectionRepository.save(Subsection.builder()
                .title("HTML Basics Quiz").contentType(ContentType.QUIZ).order(3).section(a1).build());

        Section a2 = sectionRepository.save(Section.builder().title("Building Your First App").order(2).course(courseA).build());
        Subsection a2v = subsectionRepository.save(Subsection.builder()
                .title("Your First Web Page").contentType(ContentType.VIDEO)
                .contentUrl("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4")
                .order(1).section(a2).build());
        Subsection a2a = subsectionRepository.save(Subsection.builder()
                .title("Project: Build a Landing Page").contentType(ContentType.ASSIGNMENT).order(2).section(a2).build());

        Quiz quizA = quizRepository.save(Quiz.builder().subsection(a1q).passThresholdPercent(60).allowMultipleAttempts(true).build());
        quizQuestionRepository.save(QuizQuestion.builder().quiz(quizA)
                .questionText("Which tag defines the largest heading in HTML?")
                .optionsJson("[\"<h6>\",\"<heading>\",\"<h1>\",\"<head>\"]").correctOption("<h1>").build());
        quizQuestionRepository.save(QuizQuestion.builder().quiz(quizA)
                .questionText("Which attribute specifies an alternate text for an image?")
                .optionsJson("[\"alt\",\"title\",\"src\",\"longdesc\"]").correctOption("alt").build());
        quizQuestionRepository.save(QuizQuestion.builder().quiz(quizA)
                .questionText("CSS stands for?")
                .optionsJson("[\"Cascading Style Sheets\",\"Creative Style Sheets\",\"Computer Style Sheets\",\"Colorful Style Sheets\"]")
                .correctOption("Cascading Style Sheets").build());

        assignmentRepository.save(Assignment.builder().subsection(a2a)
                .instructions("Build a single-page HTML/CSS landing page for a fictional product. Include a hero section, a features section, and a footer. Submit a link to your hosted page or a GitHub repo.")
                .allowedFileTypes("zip,url").dueDate(LocalDateTime.now().plusDays(14)).build());

        // --- Course B: paid, published, prerequisite-free, has a captured payment + refund request ---
        Course courseB = courseRepository.save(Course.builder()
                .title("Data Science with Python")
                .description("Pandas, NumPy, and your first real dataset — build a portfolio-ready analysis project.")
                .level(CourseLevel.INTERMEDIATE).price(new BigDecimal("999.00"))
                .instructor(instructor).category(dataSci)
                .active(true).published(true).isCohortBased(false).build());

        Section b1 = sectionRepository.save(Section.builder().title("Python for Data Science").order(1).course(courseB).build());
        subsectionRepository.save(Subsection.builder()
                .title("NumPy Fundamentals").contentType(ContentType.VIDEO)
                .contentUrl("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4")
                .order(1).section(b1).build());
        subsectionRepository.save(Subsection.builder()
                .title("Pandas Cheat Sheet (PDF)").contentType(ContentType.DOCUMENT)
                .contentUrl("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf")
                .order(2).section(b1).build());

        // --- Course C: paid, published, requires Course A as a prerequisite (tests FR46) -------
        courseRepository.save(Course.builder()
                .title("Advanced Web Development")
                .description("React, APIs, and deployment — the follow-up to the Bootcamp.")
                .level(CourseLevel.ADVANCED).price(new BigDecimal("1499.00"))
                .instructor(instructor).category(webDev).prerequisiteCourse(courseA)
                .active(true).published(true).isCohortBased(false).build());

        // --- Enrollments / progress for student1 in Course A (free) ----------------------------
        Enrollment enrollmentA = enrollmentRepository.save(Enrollment.builder()
                .user(student1).course(courseA).enrolledDate(LocalDate.now().minusDays(3)).revoked(false).build());
        progressRepository.save(Progress.builder().user(student1).subsection(a1v).completed(true).lastPositionSeconds(0).build());
        reviewRepository.save(Review.builder().course(courseA).student(student1).rating(5)
                .comment("Clear and practical — finally got HTML/CSS to click for me.").build());

        // --- A captured payment + pending refund request for student2 in Course B (paid) -------
        // Bypasses the real Razorpay gateway on purpose: this is what a webhook-confirmed payment
        // looks like once PaymentService.handlePaymentCaptured() has run, so Admin > Refunds and
        // Admin > Dashboard revenue have something real to show without needing live Razorpay keys.
        Enrollment enrollmentB = enrollmentRepository.save(Enrollment.builder()
                .user(student2).course(courseB).enrolledDate(LocalDate.now().minusDays(1)).revoked(false).build());
        Payment payment = paymentRepository.save(Payment.builder()
                .enrollment(enrollmentB).student(student2).course(courseB).amount(courseB.getPrice())
                .paymentReferenceId("seed_pay_" + System.currentTimeMillis())
                .razorpayOrderId("seed_order_1").status(PaymentStatus.CAPTURED)
                .paidAt(LocalDateTime.now().minusDays(1)).build());
        refundRequestRepository.save(RefundRequest.builder().payment(payment)
                .reason("Bought by mistake, would like a refund please.")
                .status(RefundStatus.REQUESTED).requestedAt(LocalDateTime.now().minusHours(6)).build());

        // --- Coupons ------------------------------------------------------------------------
        couponRepository.save(Coupon.builder().code("WELCOME10").discountType(DiscountType.PERCENTAGE)
                .discountValue(new BigDecimal("10")).usageLimit(100).timesUsed(0).createdBy(admin).build());
        couponRepository.save(Coupon.builder().code("PYTHON20").discountType(DiscountType.FLAT)
                .discountValue(new BigDecimal("200")).usageLimit(50).timesUsed(0)
                .course(courseB).createdBy(instructor).build());

        // --- TA invitation (left PENDING so logging in as the TA account exercises the accept flow) ---
        taAssignmentRepository.save(TaAssignment.builder().course(courseA).taUser(ta).invitedBy(instructor)
                .status(TaStatus.PENDING).build());

        // --- A live session slot for Course A ------------------------------------------------
        liveSessionSlotRepository.save(LiveSessionSlot.builder().instructor(instructor).course(courseA)
                .startTime(LocalDateTime.now().plusDays(2).withHour(18).withMinute(0))
                .endTime(LocalDateTime.now().plusDays(2).withHour(19).withMinute(0))
                .capacity(2).bookedCount(0).cancelled(false).build());

        log.info("DataSeeder: done. See TESTING_GUIDE.md for test account credentials and scenarios.");
    }
}
