export type SupportedLocale = 'en' | 'es' | 'hi' | 'fr';

export interface TranslationDictionary {
  nav: {
    home: string;
    courses: string;
    practice: string;
    community: string;
    leaderboard: string;
    dashboard: string;
    login: string;
    logout: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    instantDemoStudent: string;
    instantDemoInstructor: string;
    instantDemoAdmin: string;
    emailLabel: string;
    passwordLabel: string;
  };
  course: {
    enrolledCourses: string;
    continueLearning: string;
    certificates: string;
    downloadPdf: string;
    verifyCode: string;
    leaveReview: string;
    takeQuiz: string;
  };
  practice: {
    articles: string;
    codingChallenges: string;
    runCode: string;
    submitSolution: string;
    allTestCasesPassed: string;
  };
  gamification: {
    totalXp: string;
    dayStreak: string;
    leaderboardTitle: string;
    badgesTitle: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      courses: 'Courses',
      practice: 'Practice Hub',
      community: 'Community',
      leaderboard: 'Leaderboard',
      dashboard: 'Dashboard',
      login: 'Sign In',
      logout: 'Sign Out',
    },
    auth: {
      loginTitle: 'Welcome back to eLearny',
      loginSubtitle: 'Master tech skills with interactive courses & coding practice',
      instantDemoStudent: '1-Click Demo Student',
      instantDemoInstructor: '1-Click Demo Instructor',
      instantDemoAdmin: '1-Click Demo Admin',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
    },
    course: {
      enrolledCourses: 'Enrolled Courses',
      continueLearning: 'Continue Learning',
      certificates: 'My Certificates',
      downloadPdf: 'Download PDF',
      verifyCode: 'Verify Code',
      leaveReview: 'Leave a Review',
      takeQuiz: 'Take Quiz',
    },
    practice: {
      articles: 'Tech Articles',
      codingChallenges: 'Coding Challenges',
      runCode: 'Run Code',
      submitSolution: 'Submit Solution',
      allTestCasesPassed: 'All test cases passed!',
    },
    gamification: {
      totalXp: 'Total XP',
      dayStreak: 'Day Streak',
      leaderboardTitle: 'Global Leaderboard',
      badgesTitle: 'Earned Badges',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      courses: 'Cursos',
      practice: 'Centro de Práctica',
      community: 'Comunidad',
      leaderboard: 'Tabla de Clasificación',
      dashboard: 'Panel',
      login: 'Iniciar Sesión',
      logout: 'Cerrar Sesión',
    },
    auth: {
      loginTitle: 'Bienvenido de nuevo a eLearny',
      loginSubtitle: 'Domina habilidades tecnológicas con cursos interactivos',
      instantDemoStudent: 'Demo Estudiante en 1 Clic',
      instantDemoInstructor: 'Demo Instructor en 1 Clic',
      instantDemoAdmin: 'Demo Admin en 1 Clic',
      emailLabel: 'Correo Electrónico',
      passwordLabel: 'Contraseña',
    },
    course: {
      enrolledCourses: 'Cursos Inscritos',
      continueLearning: 'Continuar Aprendiendo',
      certificates: 'Mis Certificados',
      downloadPdf: 'Descargar PDF',
      verifyCode: 'Verificar Código',
      leaveReview: 'Dejar una Reseña',
      takeQuiz: 'Tomar Cuestionario',
    },
    practice: {
      articles: 'Artículos Técnicos',
      codingChallenges: 'Desafíos de Código',
      runCode: 'Ejecutar Código',
      submitSolution: 'Enviar Solución',
      allTestCasesPassed: '¡Todas las pruebas pasaron!',
    },
    gamification: {
      totalXp: 'XP Total',
      dayStreak: 'Racha de Días',
      leaderboardTitle: 'Clasificación Global',
      badgesTitle: 'Insignias Ganadas',
    },
  },
  hi: {
    nav: {
      home: 'होम',
      courses: 'कोर्सेस',
      practice: 'प्रैक्टिस हब',
      community: 'कम्युनिटी',
      leaderboard: 'लीडरबोर्ड',
      dashboard: 'डैशबोर्ड',
      login: 'साइन इन',
      logout: 'साइन आउट',
    },
    auth: {
      loginTitle: 'eLearny में आपका स्वागत है',
      loginSubtitle: 'इंटरएक्टिव कोर्सेस और कोडिंग प्रैक्टिस के साथ टेक स्किल्स सीखें',
      instantDemoStudent: '1-क्लिक स्टूडेंट डेमो',
      instantDemoInstructor: '1-क्लिक इंस्ट्रक्टर डेमो',
      instantDemoAdmin: '1-क्लिक एडमिन डेमो',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
    },
    course: {
      enrolledCourses: 'नामांकित पाठ्यक्रम',
      continueLearning: 'सीखना जारी रखें',
      certificates: 'मेरे प्रमाण पत्र',
      downloadPdf: 'पीडीएफ डाउनलोड करें',
      verifyCode: 'कोड सत्यापित करें',
      leaveReview: 'समीक्षा लिखें',
      takeQuiz: 'क्विज लें',
    },
    practice: {
      articles: 'तकनीकी लेख',
      codingChallenges: 'कोडिंग चुनौतियाँ',
      runCode: 'कोड चलाएँ',
      submitSolution: 'समाधान सबमिट करें',
      allTestCasesPassed: 'सभी टेस्ट केस पास हो गए!',
    },
    gamification: {
      totalXp: 'कुल XP',
      dayStreak: 'डे स्ट्राइक',
      leaderboardTitle: 'ग्लोबल लीडरबोर्ड',
      badgesTitle: 'अर्जित बैज',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      courses: 'Cours',
      practice: 'Pratique',
      community: 'Communauté',
      leaderboard: 'Classement',
      dashboard: 'Tableau de bord',
      login: 'Se connecter',
      logout: 'Déconnexion',
    },
    auth: {
      loginTitle: 'Bienvenue sur eLearny',
      loginSubtitle: 'Maîtrisez les compétences tech avec des cours interactifs',
      instantDemoStudent: 'Démo Étudiant en 1 Clic',
      instantDemoInstructor: 'Démo Formateur en 1 Clic',
      instantDemoAdmin: 'Démo Admin en 1 Clic',
      emailLabel: 'Adresse E-mail',
      passwordLabel: 'Mot de passe',
    },
    course: {
      enrolledCourses: 'Cours Inscrits',
      continueLearning: 'Continuer l\'apprentissage',
      certificates: 'Mes Certificats',
      downloadPdf: 'Télécharger le PDF',
      verifyCode: 'Vérifier le Code',
      leaveReview: 'Laisser un Avis',
      takeQuiz: 'Passer le Quiz',
    },
    practice: {
      articles: 'Articles Techniques',
      codingChallenges: 'Défis de Code',
      runCode: 'Exécuter le Code',
      submitSolution: 'Soumettre la Solution',
      allTestCasesPassed: 'Tous les tests sont réussis !',
    },
    gamification: {
      totalXp: 'XP Total',
      dayStreak: 'Série de Jours',
      leaderboardTitle: 'Classement Général',
      badgesTitle: 'Badges Obtenus',
    },
  },
};
