import { useState, useEffect, useRef, FormEvent, ReactNode } from 'react';

// Pre-defined image imports generated specifically for this application
import lawyerPortrait from './assets/images/lawyer_portrait_1784637215602.jpg';
import ladyJustice from './assets/images/lady_justice_1784637229216.jpg';
import lawFirmMeeting from './assets/images/law_firm_meeting_1784637241571.jpg';

// Animated Counter component for smooth scroll-triggered count-up effect
function AnimatedCounter({ end, duration = 1800, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;

          const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easeOutCubic curve
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOutProgress * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1, rootMargin: '120px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [end, duration, hasAnimated]);

  return (
    <span ref={elementRef}>
      {count}{suffix}
    </span>
  );
}

// Animated Card component for smooth scroll-triggered fade-in and slide-up animation
function AnimatedCard({ 
  children, 
  delay = 0, 
  className = "", 
  id, 
  onClick 
}: { 
  children: ReactNode; 
  delay?: number; 
  className?: string; 
  id?: string; 
  onClick?: () => void;
  key?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const timer = setTimeout(() => {
            setAnimationDone(true);
          }, delay + 700);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={onClick}
      style={{ 
        transitionDelay: animationDone ? '0ms' : `${delay}ms`
      }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Helper function to render custom vector SVG icons for practice area cards
function renderAreaIcon(areaId: string, isSelected: boolean) {
  const colorClass = isSelected ? 'text-slate-950' : 'text-amber-500';
  switch (areaId) {
    case 'penal':
      return (
        <svg className={`w-7 h-7 transition-transform duration-300 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 13l5 5m-2.5-2.5l2.5 2.5" strokeWidth="2" />
          <path d="M3 21l3-3" strokeWidth="2" />
          <path d="M9.5 6.5l8 8-3.5 3.5-8-8z" strokeWidth="1.8" />
          <path d="M6 3l3 3" strokeWidth="2" />
          <path d="M3 6l3-3" strokeWidth="2" />
        </svg>
      );
    case 'civil':
      return (
        <svg className={`w-7 h-7 transition-transform duration-300 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10L12 3L21 10" strokeWidth="2" />
          <path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9" strokeWidth="1.8" />
          <circle cx="8" cy="12" r="1.5" />
          <path d="M6 17v-0.5a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5V17" />
          <circle cx="16" cy="12" r="1.5" />
          <path d="M14 17v-0.5a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5V17" />
          <circle cx="12" cy="11.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'mercantil':
      return (
        <svg className={`w-7 h-7 transition-transform duration-300 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" strokeWidth="1.8" />
          <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" strokeWidth="1.8" />
          <path d="M12 11v4" strokeWidth="2" />
          <path d="M10 13h4" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg className={`w-7 h-7 transition-transform duration-300 ${colorClass}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" strokeWidth="2" />
          <path d="M12 16h.01" strokeWidth="2" />
        </svg>
      );
  }
}

// Helper function to render custom vector SVG icons for accreditation & quality badge buttons
function renderQualityLogoIcon(index: number, isActive: boolean, isLarge: boolean = false) {
  const sizeClass = isLarge ? "w-6 h-6" : "w-5 h-5";
  const strokeColor = isActive ? (isLarge ? "text-amber-500" : "text-slate-950") : "text-amber-600";

  switch (index) {
    case 0: // Ilustre Colegio de Abogados
      return (
        <svg className={`${sizeClass} ${strokeColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" strokeWidth="2" />
          <path d="M4 18v-7" />
          <path d="M8 18v-7" />
          <path d="M12 18v-7" />
          <path d="M16 18v-7" />
          <path d="M20 18v-7" />
          <path d="M12 3L2 10h20L12 3z" strokeWidth="1.8" />
        </svg>
      );
    case 1: // Certificación ISO 9001
      return (
        <svg className={`${sizeClass} ${strokeColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" fillOpacity="0.1" />
          <path d="M12 2l2.4 5 5.5.8-4 3.9 1 5.5-4.9-2.6L7.1 17.2l1-5.5-4-3.9 5.5-.8L12 2z" />
          <path d="M9 12l2 2 4-4" strokeWidth="2" />
        </svg>
      );
    case 2: // Asociación de Abogados de Familia
      return (
        <svg className={`${sizeClass} ${strokeColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 3: // Sello Confianza Online
      return (
        <svg className={`${sizeClass} ${strokeColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <path d="M12 15v3" strokeWidth="2" />
        </svg>
      );
    case 4: // Asociación Española de Penalistas
      return (
        <svg className={`${sizeClass} ${strokeColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 13l5 5m-2.5-2.5l2.5 2.5" strokeWidth="2" />
          <path d="M3 21l3-3" strokeWidth="2" />
          <path d="M9.5 6.5l8 8-3.5 3.5-8-8z" />
          <path d="M6 3l3 3" />
          <path d="M3 6l3-3" />
        </svg>
      );
    default:
      return (
        <svg className={`${sizeClass} ${strokeColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" strokeWidth="2" />
          <path d="M12 16h.01" strokeWidth="2" />
        </svg>
      );
  }
}

// Types for Case Evaluation Wizard
interface EvaluationAnswers {
  area: string;
  urgency: string;
  description: string;
  name: string;
  email: string;
  phone: string;
}

export default function App() {
  // Mobile navigation state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mobile slow carousel pause state for hero growing stats
  const [isStatsCarouselPaused, setIsStatsCarouselPaused] = useState(false);

  // Growing statistics numbers data displayed under hero section
  const statsData = [
    { end: 20, suffix: "+", label: "Años de Experiencia" },
    { end: 500, suffix: "+", label: "Casos Resueltos" },
    { end: 98, suffix: "%", label: "Éxito en Tribunales" },
    { end: 15, suffix: "", label: "Abogados Especialistas" },
  ];

  // Active FAQ accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Selected practice area for deep detail view
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>("penal");

  // Search/Filter state for specialties
  const [specialtySearch, setSpecialtySearch] = useState("");

  // Contact form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    especialidad: "Penal",
    mensaje: "",
    privacidad: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Appointment Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalData, setModalData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
    especialidad: "Penal",
    mensaje: ""
  });

  // Case evaluation wizard states
  const [evalStep, setEvalStep] = useState(1);
  const [evalAnswers, setEvalAnswers] = useState<EvaluationAnswers>({
    area: "",
    urgency: "",
    description: "",
    name: "",
    email: "",
    phone: ""
  });
  const [evalSuccess, setEvalSuccess] = useState(false);

  // Quality credentials & legal association logos
  const [activeLogoIndex, setActiveLogoIndex] = useState(0);
  const qualityLogos = [
    {
      name: "Ilustre Colegio de Abogados",
      badge: "Colegiación Oficial Garantizada",
      number: "Colegiado Nº 48.912",
      description: "Garantiza el ejercicio legal y la sujeción a las estrictas normas deontológicas de la abogacía española.",
      icon: "fa-solid fa-building-columns",
      authority: "Consejo General de la Abogacía"
    },
    {
      name: "Certificación ISO 9001",
      badge: "Sello de Calidad Internacional",
      number: "Gestión Jurídica Auditada",
      description: "Aval de calidad que garantiza que nuestros protocolos de confidencialidad, atención al cliente y gestión documental son excelentes.",
      icon: "fa-solid fa-stamp",
      authority: "AENOR Certificaciones"
    },
    {
      name: "Asociación de Abogados de Familia",
      badge: "Especialización Acreditada",
      number: "Miembros AEAFA Activos",
      description: "Certifica que nuestros letrados civiles reciben actualización constante en custodias, divorcios y herencias complejas.",
      icon: "fa-solid fa-people-group",
      authority: "AEAFA España"
    },
    {
      name: "Sello Confianza Online",
      badge: "Transparencia Contractual",
      number: "Privacidad Certificada",
      description: "Cumplimiento riguroso del RGPD y de los códigos éticos de información y transparencia para el cliente final.",
      icon: "fa-solid fa-user-shield",
      authority: "Confianza Online"
    },
    {
      name: "Asociación Española de Penalistas",
      badge: "Defensa Penal de Élite",
      number: "Asociados Litigantes",
      description: "Acreditación de excelencia en tribunales de apelación y audiencias provinciales en materia de derecho penal.",
      icon: "fa-solid fa-gavel",
      authority: "AEDPenal"
    }
  ];

  // Auto-play interval for quality logos carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLogoIndex((prev) => (prev + 1) % qualityLogos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Suppress third-party floating chat widget on mobile screens (< 768px) to keep bottom navigation bar clean
  useEffect(() => {
    const handleChatWidgetResponsiveVisibility = () => {
      const isMobile = window.innerWidth < 768;
      const selectors = [
        'chat-widget',
        '#chat-widget-container',
        '#chat-widget',
        '[id*="chat-widget"]',
        '[class*="chat-widget"]',
        '.lc_text-widget',
        '.lc_text-widget--btn',
        'div[id*="leadconnector"]',
        'iframe[src*="leadconnectorhq"]',
        'iframe[src*="leadconnector"]',
        'iframe[id*="chat-widget"]'
      ];
      const elements = document.querySelectorAll<HTMLElement>(selectors.join(','));
      elements.forEach((el) => {
        if (isMobile) {
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('visibility', 'hidden', 'important');
          el.style.setProperty('pointer-events', 'none', 'important');
        } else {
          el.style.removeProperty('display');
          el.style.removeProperty('visibility');
          el.style.removeProperty('pointer-events');
        }
      });
    };

    handleChatWidgetResponsiveVisibility();
    window.addEventListener('resize', handleChatWidgetResponsiveVisibility);

    const observer = new MutationObserver(() => {
      handleChatWidgetResponsiveVisibility();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', handleChatWidgetResponsiveVisibility);
      observer.disconnect();
    };
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // Handle Main Contact Form Submission
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Introduce un correo válido.";
    }
    if (!formData.privacidad) {
      errors.privacidad = "Debes aceptar la política de privacidad.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setFormSubmitted(true);
    // Auto-reset success message after 10 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        especialidad: "Penal",
        mensaje: "",
        privacidad: false
      });
    }, 8000);
  };

  // Handle Appointment Modal Submission
  const handleModalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!modalData.nombre || !modalData.telefono || !modalData.email || !modalData.fecha || !modalData.hora) {
      alert("Por favor, rellena todos los campos obligatorios.");
      return;
    }
    setModalSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setModalSubmitted(false);
      setModalData({
        nombre: "",
        telefono: "",
        email: "",
        fecha: "",
        hora: "",
        especialidad: "Penal",
        mensaje: ""
      });
    }, 4000);
  };

  // Case evaluation wizard progress
  const nextEvalStep = () => {
    if (evalStep === 1 && !evalAnswers.area) {
      alert("Por favor, selecciona una de las áreas jurídicas.");
      return;
    }
    if (evalStep === 2 && !evalAnswers.urgency) {
      alert("Por favor, selecciona el nivel de urgencia.");
      return;
    }
    if (evalStep === 3 && !evalAnswers.description.trim()) {
      alert("Por favor, describe brevemente tu situación legal.");
      return;
    }
    setEvalStep(evalStep + 1);
  };

  const handleEvalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!evalAnswers.name || !evalAnswers.email || !evalAnswers.phone) {
      alert("Por favor, rellena todos tus datos de contacto.");
      return;
    }
    setEvalSuccess(true);
    setTimeout(() => {
      setEvalSuccess(false);
      setEvalStep(1);
      setEvalAnswers({
        area: "",
        urgency: "",
        description: "",
        name: "",
        email: "",
        phone: ""
      });
    }, 8000);
  };

  // Practice area items for reference
  const practiceAreas = [
    {
      id: "penal",
      title: "Derecho Penal",
      subtitle: "Defensa penal, querellas y juicios rápidos",
      icon: "fa-solid fa-gavel",
      shortDesc: "Asistencia letrada urgente en comisarías y tribunales de toda España. Defensa ante imputaciones y querellas criminales.",
      bulletPoints: [
        "Defensa y Acusación Particular en Delitos Graves y Menores.",
        "Asistencia de Urgencia al Detenido (24/7 disponible).",
        "Juicios Rápidos, Procedimientos Abreviados y Jurados.",
        "Delitos Económicos, Estafas, Blanqueo y Delitos de Tráfico.",
        "Redacción e interposición de Denuncias y Querellas."
      ],
      ctaText: "Agendar Defensa Penal"
    },
    {
      id: "civil",
      title: "Derecho Civil y Familia",
      subtitle: "Divorcios, herencias, custodias y contratos",
      icon: "fa-solid fa-people-roof",
      shortDesc: "Acompañamiento legal humano e incisivo para proteger tus relaciones familiares, patrimonio y acuerdos civiles.",
      bulletPoints: [
        "Divorcios Contenciosos y de Mutuo Acuerdo (Express).",
        "Guarda y Custodia Compartida, Alimentos y Régimen de Visitas.",
        "Herencias y Sucesiones: Planificación testamentaria e impugnaciones.",
        "Reclamaciones de Cantidad, Impagos e Incumplimientos Contractuales.",
        "Arrendamientos, Desahucios y Propiedad Horizontal."
      ],
      ctaText: "Consultar Asunto de Familia"
    },
    {
      id: "mercantil",
      title: "Derecho Mercantil y Empresa",
      subtitle: "Asesoramiento corporativo integral y contratos",
      icon: "fa-solid fa-briefcase",
      shortDesc: "Blindaje legal para empresas, startups y autónomos. Redacción de contratos comerciales y reestructuración empresarial.",
      bulletPoints: [
        "Asesoramiento Jurídico Continuado para Empresas y Socios.",
        "Constitución de Sociedades, Ampliaciones y Actas de Junta.",
        "Redacción y Negociación de Contratos Mercantiles Nacionales/Internacionales.",
        "Propiedad Intelectual, Marcas y Protección de Datos (RGPD).",
        "Reestructuración, Concursos de Acreedores y Segunda Oportunidad."
      ],
      ctaText: "Blindar mi Empresa"
    }
  ];

  // Filter practice areas by user search input
  const filteredSpecialties = practiceAreas.filter(area => 
    area.title.toLowerCase().includes(specialtySearch.toLowerCase()) ||
    area.subtitle.toLowerCase().includes(specialtySearch.toLowerCase()) ||
    area.shortDesc.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 selection:bg-amber-500 selection:text-slate-900 bg-slate-50 text-slate-800 font-sans">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('inicio')}>
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-slate-950 shadow-inner">
              <i className="fa-solid fa-scale-balanced text-xl"></i>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Aboga<span className="text-amber-500">2</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-amber-500/80 font-semibold">
                Bufete Jurídico
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('inicio')} className="text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors duration-200">
              Inicio
            </button>
            <button onClick={() => scrollToSection('nosotros')} className="text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors duration-200">
              Nosotros
            </button>
            <button onClick={() => scrollToSection('especialidades')} className="text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors duration-200">
              Especialidades
            </button>
            <button onClick={() => scrollToSection('faqs')} className="text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors duration-200">
              Preguntas Frecuentes
            </button>
            <button onClick={() => scrollToSection('contacto')} className="text-sm font-medium text-slate-300 hover:text-amber-500 transition-colors duration-200">
              Contacto
            </button>
          </nav>

          {/* Header CTA Button */}
          <div className="hidden md:block">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <i className="fa-regular fa-calendar-check"></i>
              <span>Solicitar Cita</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown with slow 2-brand-color animation (#131921 & #ff9900) */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-amber-500/30 px-4 pt-2.5 pb-6 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-2xl relative menu-bg-aurora">
            <div className="relative z-10 space-y-2">
              {/* Site Links */}
              <div className="space-y-1">
                <button 
                  onClick={() => scrollToSection('inicio')} 
                  className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/10 hover:text-amber-400 transition-all font-medium text-sm"
                >
                  Inicio
                </button>
                <button 
                  onClick={() => scrollToSection('nosotros')} 
                  className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/10 hover:text-amber-400 transition-all font-medium text-sm"
                >
                  Nosotros
                </button>
                <button 
                  onClick={() => scrollToSection('especialidades')} 
                  className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/10 hover:text-amber-400 transition-all font-medium text-sm"
                >
                  Especialidades
                </button>
                <button 
                  onClick={() => scrollToSection('faqs')} 
                  className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/10 hover:text-amber-400 transition-all font-medium text-sm"
                >
                  Preguntas Frecuentes
                </button>
                <button 
                  onClick={() => scrollToSection('contacto')} 
                  className="block w-full text-left py-2.5 px-3 rounded-lg text-slate-200 hover:bg-white/10 hover:text-amber-400 transition-all font-medium text-sm"
                >
                  Contacto
                </button>
              </div>

              {/* Direct Contact Links (Call & Mailto) */}
              <div className="pt-2 border-t border-amber-500/20 space-y-1">
                {/* Phone call link */}
                <a 
                  href="tel:+34604065849"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 py-2 px-3 text-amber-500 hover:text-amber-400 transition-colors group"
                  aria-label="Llamar al +34 604 065 849"
                >
                  <i className="fa-solid fa-phone text-amber-500 text-base shrink-0 group-hover:scale-110 transition-transform"></i>
                  <span className="text-sm font-semibold tracking-tight">
                    +34 604 065 849
                  </span>
                </a>

                {/* Email mailto link */}
                <a 
                  href="mailto:info@websparaabogados.com"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 py-2 px-3 text-amber-500 hover:text-amber-400 transition-colors group"
                  aria-label="Enviar correo a info@websparaabogados.com"
                >
                  <i className="fa-solid fa-envelope text-amber-500 text-base shrink-0 group-hover:scale-110 transition-transform"></i>
                  <span className="text-sm font-semibold truncate">
                    info@websparaabogados.com
                  </span>
                </a>
              </div>

              {/* CTA Button */}
              <div className="pt-2 px-1">
                <button 
                  onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 py-3 rounded-xl text-center font-bold shadow-md flex items-center justify-center space-x-2 transition-all"
                >
                  <i className="fa-regular fa-calendar-check"></i>
                  <span>Solicitar Cita Gratuita</span>
                </button>
              </div>

              {/* Redes Sociales / Social Networks Links */}
              <div className="flex items-center justify-center space-x-7 pt-3 pb-2">
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}
                  className="text-amber-500 hover:text-amber-400 text-xl transition-all hover:scale-110 active:scale-95"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}
                  className="text-amber-500 hover:text-amber-400 text-xl transition-all hover:scale-110 active:scale-95"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); }}
                  className="text-amber-500 hover:text-amber-400 text-xl transition-all hover:scale-110 active:scale-95"
                  aria-label="Google My Business"
                  title="Google My Business"
                >
                  <i className="fa-brands fa-google"></i>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="inicio" className="relative text-white pt-10 pb-20 md:py-24 lg:py-32 overflow-hidden">
        {/* Animated Background: Dominant dark blue canvas with subtle amber drifting from bottom-right to top-left */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hero-ambient-canvas" aria-hidden="true">
          <div className="hero-blue-deep-aura" />
          <div className="hero-blue-drift" />
          <div className="hero-amber-drift-orb" />
          <div className="hero-amber-drift-trail" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badge / Proof */}
              <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-inner animate-pulse">
                <span className="flex items-center text-amber-500 text-xs font-bold">
                  <i className="fa-solid fa-star mr-1"></i>
                  <i className="fa-solid fa-star mr-1"></i>
                  <i className="fa-solid fa-star mr-1"></i>
                  <i className="fa-solid fa-star mr-1"></i>
                  <i className="fa-solid fa-star mr-1"></i>
                  5.0
                </span>
                <span className="text-slate-500 text-xs">|</span>
                <span className="text-slate-300 text-xs font-medium tracking-wide">
                  +250 Casos Ganados
                </span>
              </div>

              {/* Persuasive Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Defensa Legal <span className="text-amber-500">Rigurosa</span>, Estrategias de Alta Eficacia
              </h1>

              {/* Subheadline */}
              <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                En <span className="font-semibold text-white">Aboga2</span> protegemos tus derechos, tu libertad y tus intereses corporativos. Abordamos cada procedimiento con maestría jurídica y una determinación inquebrantable para asegurar el éxito de tu caso.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button 
                  onClick={() => scrollToSection('evaluador')}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 px-8 py-4 rounded-xl text-base font-bold shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <span>Consulta Gratuita</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button 
                  onClick={() => scrollToSection('especialidades')}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800 px-8 py-4 rounded-xl text-base font-semibold hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Nuestras Áreas</span>
                </button>
              </div>

              {/* Small trust logos */}
              <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-slate-400 text-xs">
                <span className="font-medium uppercase tracking-widest text-[10px] text-slate-500">Garantías del Bufete:</span>
                <span className="flex items-center"><i className="fa-solid fa-shield-halved text-amber-500 mr-1.5"></i> Abogados Colegiados</span>
                <span className="flex items-center"><i className="fa-solid fa-clock text-amber-500 mr-1.5"></i> Respuesta en 2h</span>
                <span className="flex items-center"><i className="fa-solid fa-handshake text-amber-500 mr-1.5"></i> Máxima Confidencialidad</span>
              </div>

            </div>

            {/* Right Arched Photo Frame Column (Direct replication of Screenshot 1 & 2 styles) */}
            <div className="lg:col-span-5 flex justify-center relative mt-8 lg:mt-0">
              
              {/* Spinning Circular stamp sticker */}
              <div className="absolute top-4 -left-4 z-20 bg-amber-500 text-slate-950 w-28 h-28 rounded-full flex flex-col items-center justify-center text-center p-2 shadow-2xl border-4 border-slate-950 font-serif rotate-12 transition-transform hover:rotate-45 duration-1000 cursor-pointer select-none">
                <span className="text-[9px] uppercase tracking-widest font-bold text-slate-900">Servicios</span>
                <span className="text-xs font-extrabold uppercase text-slate-950 border-y border-slate-950 py-0.5 my-0.5">Premium</span>
                <span className="text-[8px] uppercase tracking-wider font-bold text-slate-800">Profesionales</span>
              </div>

              {/* Arched main photo frame */}
              <div className="relative w-72 sm:w-80 h-[420px] sm:h-[480px] rounded-t-full border-[6px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden group">
                <img 
                  src={lawyerPortrait} 
                  alt="Socio Principal de Aboga2" 
                  className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual gradient inside the arch */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent h-1/3"></div>
                
                {/* Visual card badge over image */}
                <div className="absolute bottom-6 inset-x-4 bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center backdrop-blur-sm">
                  <h4 className="font-serif text-sm font-bold text-white">Sofía Torres Alarcón</h4>
                  <p className="text-[10px] uppercase text-amber-500 tracking-wider font-medium">Directora de Litigación Penal</p>
                </div>
              </div>

              {/* Decorative background framing */}
              <div className="absolute -inset-2 rounded-t-full border border-amber-500/20 -z-10 transform translate-x-2 translate-y-2"></div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS COUNTER BAR (Desktop multi-column grid & Mobile continuous slow carousel) */}
      <section className="bg-amber-500 text-slate-950 relative z-10 py-6 md:py-8 shadow-xl overflow-hidden">
        {/* Desktop Layout (md and up: clean 4-column responsive grid) */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-y-8 gap-x-4 text-center divide-x divide-slate-950/10">
            {statsData.map((stat, idx) => (
              <div key={idx} className="flex flex-col justify-center py-2">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </span>
                <span className="text-xs sm:text-sm uppercase tracking-wider font-bold text-slate-900 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout (< md: continuous very slow carousel) */}
        <div className="block md:hidden relative w-full overflow-hidden">
          {/* Subtle edge fades to blend smoothly into amber bar */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-amber-500 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-amber-500 to-transparent z-10" />

          {/* Carousel Track with pause-on-touch/hover */}
          <div 
            className="animate-stats-carousel-slow flex items-center select-none py-1"
            style={{ animationPlayState: isStatsCarouselPaused ? 'paused' : 'running' }}
            onTouchStart={() => setIsStatsCarouselPaused(true)}
            onTouchEnd={() => setIsStatsCarouselPaused(false)}
            onMouseEnter={() => setIsStatsCarouselPaused(true)}
            onMouseLeave={() => setIsStatsCarouselPaused(false)}
          >
            {/* First Set of Stats */}
            {statsData.map((stat, idx) => (
              <div key={`stat-a-${idx}`} className="flex items-center shrink-0">
                <div className="flex flex-col items-center justify-center py-1.5 px-6 sm:px-8 min-w-[210px] text-center">
                  <span className="font-serif text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-900 mt-1 whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-950/20 shrink-0 self-center" aria-hidden="true" />
              </div>
            ))}

            {/* Second Set of Stats for 100% Seamless Infinite Loop */}
            {statsData.map((stat, idx) => (
              <div key={`stat-b-${idx}`} className="flex items-center shrink-0">
                <div className="flex flex-col items-center justify-center py-1.5 px-6 sm:px-8 min-w-[210px] text-center">
                  <span className="font-serif text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-900 mt-1 whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>
                <div className="h-7 w-px bg-slate-950/20 shrink-0 self-center" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACREDITACIONES Y CERTIFICADOS DE CALIDAD (Carousel de Prueba Social) */}
      <section className="py-16 bg-slate-100 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-amber-600 font-extrabold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Prueba Social y Respaldo Oficial
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Acreditaciones y Sellos de Calidad Jurídica
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Estamos integrados y auditados por las máximas instituciones del Derecho y normativas de excelencia en España para garantizarle la máxima seguridad jurídica.
            </p>
          </div>

          {/* Interactive Carousel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            
            {/* Left side: List of all triggers/badges (Hidden on mobile, beautiful list on desktop) */}
            <div className="hidden lg:col-span-4 lg:flex flex-col space-y-3">
              {qualityLogos.map((logo, idx) => {
                const isActive = activeLogoIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveLogoIndex(idx)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center space-x-3 transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-900 border-amber-500 text-white shadow-md translate-x-2'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-amber-600'
                    }`}>
                      {renderQualityLogoIcon(idx, isActive, false)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold truncate">{logo.name}</span>
                      <span className={`block text-[10px] truncate ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                        {logo.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right side: Highlighted active credential card (with carousel controls and responsive triggers) */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-md relative min-h-[220px] flex flex-col justify-between transition-all duration-300">
                
                {/* Carousel content */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold bg-amber-500/10 px-3 py-1 rounded-full">
                      {qualityLogos[activeLogoIndex].badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-medium">
                      {qualityLogos[activeLogoIndex].number}
                    </span>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-500/15 text-amber-600 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      {renderQualityLogoIcon(activeLogoIndex, false, true)}
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                        {qualityLogos[activeLogoIndex].name}
                      </h4>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Entidad Reguladora: <span className="text-slate-700">{qualityLogos[activeLogoIndex].authority}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic pl-0 sm:pl-16">
                    "{qualityLogos[activeLogoIndex].description}"
                  </p>
                </div>

                {/* Navigation arrows & page dots */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                  
                  {/* Indicators / Dots */}
                  <div className="flex items-center space-x-1.5">
                    {qualityLogos.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveLogoIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeLogoIndex === idx ? 'w-6 bg-amber-500' : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Arrow controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveLogoIndex((prev) => (prev - 1 + qualityLogos.length) % qualityLogos.length)}
                      className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-500/5 transition-all flex items-center justify-center text-xs"
                      aria-label="Previous slide"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={() => setActiveLogoIndex((prev) => (prev + 1) % qualityLogos.length)}
                      className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-500/5 transition-all flex items-center justify-center text-xs"
                      aria-label="Next slide"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* Sencillo grid de logotipos en versión móvil para pulsar directamente */}
          <div className="grid grid-cols-5 gap-2 mt-8 max-w-lg mx-auto lg:hidden">
            {qualityLogos.map((logo, idx) => {
              const isActive = activeLogoIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveLogoIndex(idx)}
                  className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                    isActive
                      ? 'bg-slate-900 border-amber-500 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                  aria-label={logo.name}
                >
                  <i className={`${logo.icon} text-sm ${isActive ? 'text-amber-500' : 'text-slate-400'}`}></i>
                  <span className="text-[7px] font-bold uppercase tracking-wider text-center block truncate w-full px-0.5">
                    {logo.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* PRACTICE AREAS / ESPECIALIDADES GRID (Based on Services Screenshot 3) */}
      <section id="especialidades" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Description */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold bg-amber-500/10 px-3.5 py-1 rounded-full">
              Nuestras Especialidades
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Defensa Integral a la Medida de tus Necesidades
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Ofrecemos servicios jurídicos de la más alta solvencia en las principales áreas del derecho español. Selecciona un área para ver más detalles técnicos de cobertura.
            </p>

            {/* Dynamic Search / Filter Specialty Bar */}
            <div className="pt-6 max-w-md mx-auto">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input 
                  type="text" 
                  value={specialtySearch}
                  onChange={(e) => setSpecialtySearch(e.target.value)}
                  placeholder="Buscar especialidad legal..."
                  className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm"
                />
                {specialtySearch && (
                  <button 
                    onClick={() => setSpecialtySearch("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid of specialties (3 Primary Areas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {filteredSpecialties.map((area, idx) => {
              const isSelected = selectedPracticeArea === area.id;
              return (
                <AnimatedCard 
                  key={area.id}
                  id={`card-${area.id}`}
                  delay={idx * 150}
                  onClick={() => setSelectedPracticeArea(area.id)}
                  className={`cursor-pointer rounded-2xl p-8 border flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-slate-900 border-amber-500 text-white shadow-xl scale-102 ring-1 ring-amber-500' 
                      : 'bg-white border-slate-200 text-slate-800 hover:border-amber-500/40 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isSelected 
                        ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-amber-500/20 scale-105' 
                        : 'bg-gradient-to-br from-amber-500/15 to-amber-600/5 text-amber-600 border border-amber-500/20 group-hover:scale-105'
                    }`}>
                      {renderAreaIcon(area.id, isSelected)}
                    </div>

                    {/* Area Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                      {area.title}
                    </h3>

                    {/* Area Subtitle */}
                    <p className={`text-xs uppercase font-medium tracking-wide ${
                      isSelected ? 'text-amber-400' : 'text-amber-600'
                    }`}>
                      {area.subtitle}
                    </p>

                    {/* Short Description */}
                    <p className={`text-sm leading-relaxed ${
                      isSelected ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {area.shortDesc}
                    </p>
                  </div>

                  {/* Interactive Trigger link */}
                  <div className="pt-6 border-t border-dashed border-slate-700/20 mt-6 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">Ver Cobertura</span>
                    <i className={`fa-solid fa-arrow-right text-xs transition-transform ${
                      isSelected ? 'text-amber-400 translate-x-1' : 'text-slate-400'
                    }`}></i>
                  </div>
                </AnimatedCard>
              );
            })}
          </div>

          {/* Practice Area Deep Details Panel (Interactive View of Selected Specialty) */}
          {selectedPracticeArea && practiceAreas.find(a => a.id === selectedPracticeArea) && (
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden transition-all duration-500">
              
              {/* Background watermark */}
              <div className="absolute right-0 bottom-0 opacity-[0.03] text-white text-[200px] pointer-events-none translate-y-1/4 translate-x-1/4">
                <i className={practiceAreas.find(a => a.id === selectedPracticeArea)?.icon}></i>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                
                {/* Details side */}
                <div className="space-y-6">
                  <div>
                    <span className="text-amber-500 text-xs uppercase tracking-widest font-bold">Detalle de Cobertura Legal</span>
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-1 text-white">
                      {practiceAreas.find(a => a.id === selectedPracticeArea)?.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2">
                      {practiceAreas.find(a => a.id === selectedPracticeArea)?.shortDesc}
                    </p>
                  </div>

                  {/* Bullet points detailing the expertise */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase font-semibold text-slate-300 tracking-wider">Servicios Especializados Incluidos:</h4>
                    <ul className="space-y-2.5">
                      {practiceAreas.find(a => a.id === selectedPracticeArea)?.bulletPoints.map((bullet, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-300">
                          <span className="text-amber-500 mr-2.5 mt-1 text-xs">
                            <i className="fa-solid fa-circle-check"></i>
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking Trigger inside specialty */}
                  <div className="pt-4">
                    <button 
                      onClick={() => {
                        setModalData({
                          ...modalData,
                          especialidad: practiceAreas.find(a => a.id === selectedPracticeArea)?.title || "Penal"
                        });
                        setIsModalOpen(true);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 rounded-lg font-bold text-sm tracking-wide transition-all shadow-lg flex items-center space-x-2"
                    >
                      <i className="fa-regular fa-calendar-days"></i>
                      <span>{practiceAreas.find(a => a.id === selectedPracticeArea)?.ctaText}</span>
                    </button>
                  </div>
                </div>

                {/* Imagery / visual side with Lady Justice watermark and stats overview */}
                <div className="bg-slate-950/60 p-6 md:p-8 rounded-2xl border border-slate-800/80 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-lg">
                      <i className="fa-solid fa-balance-scale"></i>
                    </div>
                    <div>
                      <h4 className="font-serif text-lg font-bold text-white">¿Por qué confiar tu defensa a Aboga2?</h4>
                      <p className="text-xs text-slate-400">Nuestro compromiso se rige por un método estricto</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "Toda persona y empresa tiene derecho a una defensa impecable. No admitimos el azar en nuestras estrategias; cada litigio se prepara bajo un riguroso análisis técnico de pruebas, jurisprudencia y precedentes."
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="block font-serif text-lg font-extrabold text-amber-500">24 Horas</span>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Respuesta Urgente</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="block font-serif text-lg font-extrabold text-amber-500">98% Casos</span>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ganados / Acuerdos</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* WHY CHOOSE US & CORE VALUES SECTION (Based on About Screenshot 2) */}
      <section id="nosotros" className="py-20 md:py-28 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Image Column (featuring Lady Justice and classical layout blocks) */}
            <div className="lg:col-span-5 relative space-y-6">
              
              {/* Outer decorative box */}
              <div className="absolute -inset-4 border border-amber-500/10 rounded-3xl -z-10 transform -rotate-1"></div>
              
              {/* Lady Justice statue photo */}
              <div className="rounded-2xl border-[5px] border-slate-100 shadow-xl overflow-hidden aspect-[4/3] bg-slate-100 relative group">
                <img 
                  src={ladyJustice} 
                  alt="Estatua de la Justicia de Aboga2" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/10 mix-blend-multiply"></div>
              </div>

              {/* Mission/Vision Box Overlay styling */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 relative z-10 -mt-12 ml-6 mr-2">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 text-xs">
                    <i className="fa-solid fa-eye"></i>
                  </div>
                  <h4 className="font-serif text-base font-bold text-white">Nuestra Visión</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Consolidar el derecho como una herramienta ágil y transparente para el ciudadano. Creemos en una abogacía sin tecnicismos oscuros, fundamentada en la confianza absoluta, presupuestos claros y un rigor profesional inquebrantable.
                </p>
              </div>

            </div>

            {/* Right Values Column */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-amber-600 font-bold bg-amber-500/10 px-3.5 py-1 rounded-full">
                  Nuestros Valores Core
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                  ¿Por qué somos el bufete preferido de nuestros clientes?
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Fundamos Aboga2 con la firme determinación de revolucionar el servicio jurídico español. Superamos las barreras de la abogacía tradicional apostando por 4 pilares fundamentales de excelencia operacional:
                </p>
              </div>

              {/* 4 Value Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                {/* Value 1 */}
                <div className="space-y-2.5 p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-md font-bold">
                    <i className="fa-solid fa-user-tie"></i>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900">Atención Personalizada</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No eres un número de expediente. Tu abogado asignado estará al teléfono siempre que lo necesites, diseñando tu caso con dedicación artesanal.
                  </p>
                </div>

                {/* Value 2 */}
                <div className="space-y-2.5 p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-md font-bold">
                    <i className="fa-solid fa-receipt"></i>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900">Transparencia Total</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Trabajamos bajo presupuestos totalmente cerrados en hoja de encargo. Te garantizamos absoluta claridad en honorarios, sin sorpresas imprevistas.
                  </p>
                </div>

                {/* Value 3 */}
                <div className="space-y-2.5 p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-md font-bold">
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900">Rapidez de Actuación</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Actuamos con urgencia. El tiempo es de crucial importancia para el éxito de tus reclamaciones penales, mercantiles o contractuales.
                  </p>
                </div>

                {/* Value 4 */}
                <div className="space-y-2.5 p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center text-md font-bold">
                    <i className="fa-solid fa-ribbon"></i>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900">Rigor Profesional</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nuestros especialistas cuentan con formación continua de postgrado y amplios años de experiencia en estrados y tribunales españoles.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE CASE ASSESSOR / EVALUATOR WIZARD (High-Converting Custom Widget) */}
      <section id="evaluador" className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={lawFirmMeeting} 
            alt="Law firm advisory session background" 
            className="w-full h-full object-cover opacity-10 filter blur-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/80"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Text */}
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-bold bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              Evaluación Gratuita
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Simulador de Caso y Diagnóstico Legal
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              Obtén una primera valoración de viabilidad jurídica sin compromiso. Completa los 4 pasos del asistente y nuestros expertos evaluarán tu caso en menos de 2 horas laborables.
            </p>
          </div>

          {/* Interactive Card Container */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8 max-w-md mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
              
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all ${
                    evalStep === step 
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20' 
                      : evalStep > step 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {evalStep > step ? <i className="fa-solid fa-check"></i> : step}
                </div>
              ))}
            </div>

            {/* Step Contents */}
            {!evalSuccess ? (
              <div>
                
                {/* STEP 1: SELECT AREA */}
                {evalStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-center text-white">
                      Paso 1: ¿De qué área jurídica es tu asunto?
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <button 
                        type="button"
                        onClick={() => setEvalAnswers({ ...evalAnswers, area: "Penal" })}
                        className={`p-5 rounded-2xl border text-left flex items-center space-x-4 transition-all group ${
                          evalAnswers.area === "Penal" 
                            ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="w-11 h-11 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 13l5 5m-2.5-2.5l2.5 2.5" strokeWidth="2" />
                            <path d="M3 21l3-3" strokeWidth="2" />
                            <path d="M9.5 6.5l8 8-3.5 3.5-8-8z" />
                            <path d="M6 3l3 3" />
                            <path d="M3 6l3-3" />
                          </svg>
                        </span>
                        <div>
                          <span className="block font-bold text-sm">Derecho Penal</span>
                          <span className="text-[10px] text-slate-400">Defensa, querellas, juicios rápidos</span>
                        </div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setEvalAnswers({ ...evalAnswers, area: "Civil / Familia" })}
                        className={`p-5 rounded-2xl border text-left flex items-center space-x-4 transition-all group ${
                          evalAnswers.area === "Civil / Familia" 
                            ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="w-11 h-11 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 10L12 3L21 10" stroke="currentColor" strokeWidth="2" />
                            <circle cx="7.5" cy="11.5" r="1.5" />
                            <path d="M5.5 17.5v-1a2 2 0 0 1 2-2h0.5a2 2 0 0 1 2 2v1" />
                            <circle cx="12" cy="13.5" r="1.2" />
                            <path d="M10.5 18.5v-0.5a1.5 1.5 0 0 1 1.5-1.5h0a1.5 1.5 0 0 1 1.5 1.5v0.5" />
                            <circle cx="16.5" cy="11.5" r="1.5" />
                            <path d="M14.5 17.5v-1a2 2 0 0 1 2-2h0.5a2 2 0 0 1 2 2v1" />
                            <path d="M4 21h16" strokeWidth="1.5" opacity="0.6" />
                          </svg>
                        </span>
                        <div>
                          <span className="block font-bold text-sm">Derecho Civil y Familia</span>
                          <span className="text-[10px] text-slate-400">Divorcios, herencias, custodias</span>
                        </div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setEvalAnswers({ ...evalAnswers, area: "Mercantil / Empresa" })}
                        className={`p-5 rounded-2xl border text-left flex items-center space-x-4 transition-all group ${
                          evalAnswers.area === "Mercantil / Empresa" 
                            ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="w-11 h-11 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                        </span>
                        <div>
                          <span className="block font-bold text-sm">Derecho Mercantil</span>
                          <span className="text-[10px] text-slate-400">Asesoramiento corporativo, marcas</span>
                        </div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setEvalAnswers({ ...evalAnswers, area: "Otro" })}
                        className={`p-5 rounded-2xl border text-left flex items-center space-x-4 transition-all group ${
                          evalAnswers.area === "Otro" 
                            ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="w-11 h-11 bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                          <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M12 8v4" strokeWidth="2" />
                            <path d="M12 16h.01" strokeWidth="2" />
                          </svg>
                        </span>
                        <div>
                          <span className="block font-bold text-sm">Otros asuntos</span>
                          <span className="text-[10px] text-slate-400">Impagos, desahucios, reclamaciones</span>
                        </div>
                      </button>

                    </div>
                  </div>
                )}

                {/* STEP 2: SELECT URGENCY */}
                {evalStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-center text-white">
                      Paso 2: ¿Cuál es el grado de urgencia de tu caso?
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <button 
                        type="button"
                        onClick={() => setEvalAnswers({ ...evalAnswers, urgency: "Inmediata / Citación" })}
                        className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center space-y-3 transition-all ${
                          evalAnswers.urgency === "Inmediata / Citación" 
                            ? 'bg-red-500/10 border-red-500 text-white ring-1 ring-red-500' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="text-2xl text-red-500">
                          <i className="fa-solid fa-triangle-exclamation"></i>
                        </span>
                        <div>
                          <span className="block font-bold text-sm">Urgencia Inmediata</span>
                          <span className="text-[10px] text-slate-400 block mt-1">Tengo citación judicial o detención</span>
                        </div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setEvalAnswers({ ...evalAnswers, urgency: "En conflicto" })}
                        className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center space-y-3 transition-all ${
                          evalAnswers.urgency === "En conflicto" 
                            ? 'bg-amber-500/10 border-amber-500 text-white' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="text-2xl text-amber-500">
                          <i className="fa-solid fa-handshake-slash"></i>
                        </span>
                        <div>
                          <span className="block font-bold text-sm">Conflicto en Curso</span>
                          <span className="text-[10px] text-slate-400 block mt-1">Sufro un conflicto sin acuerdo</span>
                        </div>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setEvalAnswers({ ...evalAnswers, urgency: "Preventiva" })}
                        className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center space-y-3 transition-all ${
                          evalAnswers.urgency === "Preventiva" 
                            ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="text-2xl text-emerald-400">
                          <i className="fa-solid fa-user-shield"></i>
                        </span>
                        <div>
                          <span className="block font-bold text-sm">Preventiva / Consulta</span>
                          <span className="text-[10px] text-slate-400 block mt-1">Asesoramiento general preventivo</span>
                        </div>
                      </button>

                    </div>
                  </div>
                )}

                {/* STEP 3: BRIEF DESCRIPTION */}
                {evalStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-center text-white">
                      Paso 3: Describe brevemente los hechos de tu caso
                    </h3>
                    
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Hechos principales o consulta:</label>
                      <textarea 
                        rows={4}
                        value={evalAnswers.description}
                        onChange={(e) => setEvalAnswers({ ...evalAnswers, description: e.target.value })}
                        placeholder="Por ejemplo: He recibido una notificación de embargo por impago contractual de un proveedor... o Quiero iniciar un trámite de divorcio de mutuo acuerdo..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONTACT INFO */}
                {evalStep === 4 && (
                  <form onSubmit={handleEvalSubmit} className="space-y-6">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-center text-white">
                      Paso 4: Datos de contacto para recibir tu Informe
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Nombre Completo:</label>
                        <input 
                          type="text"
                          required
                          value={evalAnswers.name}
                          onChange={(e) => setEvalAnswers({ ...evalAnswers, name: e.target.value })}
                          placeholder="Tu nombre completo"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Teléfono Móvil:</label>
                        <input 
                          type="tel"
                          required
                          value={evalAnswers.phone}
                          onChange={(e) => setEvalAnswers({ ...evalAnswers, phone: e.target.value })}
                          placeholder="Ej: +34 600 000 000"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1.5">Correo Electrónico:</label>
                      <input 
                        type="email"
                        required
                        value={evalAnswers.email}
                        onChange={(e) => setEvalAnswers({ ...evalAnswers, email: e.target.value })}
                        placeholder="tuemail@ejemplo.com"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="text-slate-400 text-[10px] leading-relaxed">
                      Al enviar, consientes que Aboga2 trate tus datos exclusivamente para enviarte el diagnóstico jurídico preliminar de viabilidad. No se enviará publicidad comercial.
                    </div>
                  </form>
                )}

                {/* Footer buttons for Wizard */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
                  {evalStep > 1 ? (
                    <button 
                      type="button"
                      onClick={() => setEvalStep(evalStep - 1)}
                      className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                      <i className="fa-solid fa-chevron-left mr-2"></i> Atrás
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {evalStep < 4 ? (
                    <button 
                      type="button"
                      onClick={nextEvalStep}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center space-x-2"
                    >
                      <span>Siguiente</span>
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleEvalSubmit}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Enviar Diagnóstico</span>
                    </button>
                  )}
                </div>

              </div>
            ) : (
              // Success feedback screen for evaluation wizard
              <div className="text-center py-12 space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-white">¡Caso Recibido Correctamente!</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Muchas gracias <span className="text-white font-semibold">{evalAnswers.name}</span>. Hemos transferido tus hechos de <span className="text-amber-500 font-semibold">{evalAnswers.area}</span> a nuestro equipo especializado.
                  </p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-sm mx-auto text-xs text-left space-y-2.5">
                  <span className="block font-bold text-slate-300 uppercase tracking-wider text-[9px] border-b border-slate-800 pb-1.5">Resumen de Evaluación:</span>
                  <p><span className="text-slate-500">Área:</span> {evalAnswers.area}</p>
                  <p><span className="text-slate-500">Urgencia:</span> {evalAnswers.urgency}</p>
                  <p><span className="text-slate-500">Compromiso:</span> Te llamaremos al <span className="text-white">{evalAnswers.phone}</span> en menos de 2h laborables para darte respuesta.</p>
                </div>
                <button 
                  onClick={() => {
                    setEvalSuccess(false);
                    setEvalStep(1);
                    setEvalAnswers({
                      area: "",
                      urgency: "",
                      description: "",
                      name: "",
                      email: "",
                      phone: ""
                    });
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-6 py-2.5 rounded-lg text-xs font-semibold"
                >
                  Evaluar otro caso
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* CLIENT TESTIMONIALS SECTION (Direct representation of Screenshot 1 & 2 styles) */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold bg-amber-500/10 px-3.5 py-1 rounded-full">
              Testimonios de Clientes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Garantía Avalada por Casos de Éxito Reales
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              La mayor satisfacción de nuestro bufete es la tranquilidad de quienes confían en nosotros. Estos son los testimonios reales de clientes que han ganado sus litigios.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
              <span className="absolute top-6 right-8 text-6xl text-amber-500/10 font-serif select-none pointer-events-none">“</span>
              <div className="space-y-4">
                <div className="text-amber-500 text-xs">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "Excepcional defensa penal de Sofía Torres Alarcón en un juicio rápido. Súper profesional, transparente en todo momento con la hoja de encargo económica y con un resultado excelente de absolución."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-100">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 font-bold rounded-full flex items-center justify-center text-sm">
                  CM
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-slate-900">Carlos Mendoza</h4>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Caso de Derecho Penal</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
              <span className="absolute top-6 right-8 text-6xl text-amber-500/10 font-serif select-none pointer-events-none">“</span>
              <div className="space-y-4">
                <div className="text-amber-500 text-xs">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "Gestionaron mi proceso de custodia compartida y divorcio. El trato de todo el bufete fue increíblemente humano y empático, protegiendo siempre el bienestar de mis hijos. No puedo estar más agradecida."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-100">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 font-bold rounded-full flex items-center justify-center text-sm">
                  CO
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-slate-900">Carmen Ortiz</h4>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Caso de Derecho de Familia</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative">
              <span className="absolute top-6 right-8 text-6xl text-amber-500/10 font-serif select-none pointer-events-none">“</span>
              <div className="space-y-4">
                <div className="text-amber-500 text-xs">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "Llevamos 3 años con Aboga2 como bufete asesor para nuestra corporación. Redacción excelente de contratos de inversión y defensa corporativa impecable. Nos aportan la tranquilidad necesaria para escalar el negocio."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-100">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 font-bold rounded-full flex items-center justify-center text-sm">
                  AG
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-slate-900">Alejandro Gómez</h4>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">CEO Tech-Iberia (Mercantil)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION (Based on FAQ Accordion in Screenshot 1 & About Screenshot 2) */}
      <section id="faqs" className="py-20 md:py-28 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold bg-amber-500/10 px-3.5 py-1 rounded-full">
              Resolución de Dudas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Preguntas Frecuentes Legales
            </h2>
            <p className="text-slate-600 text-base">
              Resolvemos tus inquietudes preliminares sobre el funcionamiento de nuestros servicios legales en España.
            </p>
          </div>

          {/* Accordion Container */}
          <div className="space-y-4">
            
            {/* FAQ 1 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-sm">
              <button 
                onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                className="w-full text-left px-6 py-5 sm:px-8 flex items-center justify-between focus:outline-none bg-slate-50 hover:bg-slate-100/60 transition-colors"
              >
                <span className="font-serif font-bold text-slate-900 text-base sm:text-lg pr-4">
                  ¿Cómo se determinan los honorarios para mi caso?
                </span>
                <span className="text-amber-500 text-md ml-2 shrink-0">
                  <i className={`fa-solid ${activeFaq === 0 ? 'fa-minus' : 'fa-plus'} transition-transform duration-300`}></i>
                </span>
              </button>
              
              {activeFaq === 0 && (
                <div className="px-6 py-5 sm:px-8 bg-white border-t border-slate-100 text-slate-600 text-sm leading-relaxed animate-fade-in">
                  En <span className="font-semibold text-slate-900">Aboga2</span> trabajamos bajo el principio de transparencia absoluta. Tras una primera consulta de diagnóstico, te entregamos una hoja de encargo profesional con presupuesto totalmente cerrado y desglosado. Ofrecemos posibilidades de fraccionamiento de pagos a medida y financiación sin intereses para garantizar tu acceso a una defensa de la más alta calidad sin sorpresas económicas.
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-sm">
              <button 
                onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                className="w-full text-left px-6 py-5 sm:px-8 flex items-center justify-between focus:outline-none bg-slate-50 hover:bg-slate-100/60 transition-colors"
              >
                <span className="font-serif font-bold text-slate-900 text-base sm:text-lg pr-4">
                  ¿Qué debo aportar para mi primera consulta gratuita de diagnóstico?
                </span>
                <span className="text-amber-500 text-md ml-2 shrink-0">
                  <i className={`fa-solid ${activeFaq === 1 ? 'fa-minus' : 'fa-plus'} transition-transform duration-300`}></i>
                </span>
              </button>
              
              {activeFaq === 1 && (
                <div className="px-6 py-5 sm:px-8 bg-white border-t border-slate-100 text-slate-600 text-sm leading-relaxed animate-fade-in">
                  Te recomendamos encarecidamente traer o enviarnos digitalmente toda la documentación que dispongas de tu situación actual: contratos, citaciones judiciales, notificaciones de la administración, denuncias previas, escrituras públicas, nóminas o intercambios de correos electrónicos. Cuanto mayor volumen de hechos contrastados posea nuestro especialista, más acertada y estratégica será la valoración preliminar de viabilidad.
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white shadow-sm">
              <button 
                onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                className="w-full text-left px-6 py-5 sm:px-8 flex items-center justify-between focus:outline-none bg-slate-50 hover:bg-slate-100/60 transition-colors"
              >
                <span className="font-serif font-bold text-slate-900 text-base sm:text-lg pr-4">
                  ¿Es posible solucionar mi conflicto de forma amistosa sin acudir a juicio?
                </span>
                <span className="text-amber-500 text-md ml-2 shrink-0">
                  <i className={`fa-solid ${activeFaq === 2 ? 'fa-minus' : 'fa-plus'} transition-transform duration-300`}></i>
                </span>
              </button>
              
              {activeFaq === 2 && (
                <div className="px-6 py-5 sm:px-8 bg-white border-t border-slate-100 text-slate-600 text-sm leading-relaxed animate-fade-in">
                  Totalmente. Nuestro método siempre prioriza la negociación extrajudicial y la mediación corporativa/familiar en la primera fase del conflicto. Esto permite a nuestros clientes ahorrar significativos costes, meses de espera angustiosa y estrés procesal. Acudimos al litigio en tribunales únicamente cuando la vía amistosa resulta inviable o cuando sea la única forma efectiva de resguardar y hacer valer de manera contundente tus derechos legítimos.
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* CONTACT SECTION WITH TWO COLUMNS (Replicating requirements and structure) */}
      <section id="contacto" className="py-20 md:py-28 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: My Agency Contact Details Card (EMBEDDED) */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-amber-600 font-bold bg-amber-500/10 px-3.5 py-1 rounded-full inline-block">
                  Canales de Atención
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Oficina Central e Información
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Puedes agendar tu cita presencial en nuestras oficinas o contactarnos directamente a través de cualquiera de nuestros canales habilitados. Respondemos tus consultas urgentes en menos de 2 horas.
                </p>
              </div>

              {/* AGENCY CONTACT CARD */}
              <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                
                {/* Agency Brand header */}
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-[10px] uppercase tracking-widest text-amber-500 block font-bold">Desarrollado y Gestionado por</span>
                  <span className="font-serif text-xl font-bold tracking-wide text-white block mt-1">
                    Webs Para Abogados
                  </span>
                </div>

                {/* Specific details */}
                <div className="space-y-4">
                  
                  {/* WhatsApp / Teléfono */}
                  <a 
                    href="https://wa.me/34604065849" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start space-x-4 group p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-md shrink-0 group-hover:scale-105 transition-transform">
                      <i className="fa-brands fa-whatsapp"></i>
                    </span>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Teléfono / WhatsApp</span>
                      <span className="font-mono text-sm text-slate-100 group-hover:text-amber-500 transition-colors">
                        +34 604 065 849
                      </span>
                    </div>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:info@websparaabogados.com"
                    className="flex items-start space-x-4 group p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-md shrink-0 group-hover:scale-105 transition-transform">
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Email General</span>
                      <span className="font-mono text-sm text-slate-100 group-hover:text-amber-500 transition-colors">
                        info@websparaabogados.com
                      </span>
                    </div>
                  </a>

                  {/* Web */}
                  <a 
                    href="https://websparaabogados.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start space-x-4 group p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center text-md shrink-0 group-hover:scale-105 transition-transform">
                      <i className="fa-solid fa-globe"></i>
                    </span>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Página Web</span>
                      <span className="font-mono text-sm text-slate-100 group-hover:text-amber-500 transition-colors">
                        websparaabogados.com
                      </span>
                    </div>
                  </a>

                  {/* Dirección */}
                  <div className="flex items-start space-x-4 p-1.5">
                    <span className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center text-md shrink-0">
                      <i className="fa-solid fa-location-dot"></i>
                    </span>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Ubicación</span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Av. Celanova 72, Piso 3A, Ourense, España 32002
                      </p>
                    </div>
                  </div>

                </div>

                {/* Quality pledge */}
                <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Horario de Atención: Lun-Vie (09:00 - 19:00)</span>
                  <span className="text-amber-500/80 font-bold"><i className="fa-solid fa-award"></i> Oficial</span>
                </div>
              </div>

            </div>

            {/* Right Column: Complete Contact Form with client validation */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
              
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">Solicita tu Asesoría Preliminar</h3>
                <p className="text-slate-500 text-xs mt-1">Completa tus datos y un abogado especialista contactará contigo de inmediato.</p>
              </div>

              {!formSubmitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Nombre */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Nombre Completo: *</label>
                      <input 
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Introduce tu nombre"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                          formErrors.nombre ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                      {formErrors.nombre && <p className="text-red-500 text-[10px] font-bold">{formErrors.nombre}</p>}
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Teléfono de Contacto: *</label>
                      <input 
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="Ej: +34 600 000 000"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                          formErrors.telefono ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                      {formErrors.telefono && <p className="text-red-500 text-[10px] font-bold">{formErrors.telefono}</p>}
                    </div>
                  </div>

                  {/* Email & Specialty selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Correo */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Correo Electrónico: *</label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tuemail@ejemplo.com"
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                          formErrors.email ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                      {formErrors.email && <p className="text-red-500 text-[10px] font-bold">{formErrors.email}</p>}
                    </div>

                    {/* Especialidad select */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Especialidad de Interés:</label>
                      <select 
                        value={formData.especialidad}
                        onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Penal">Derecho Penal</option>
                        <option value="Civil y Familia">Derecho Civil y Familia</option>
                        <option value="Mercantil y Empresa">Derecho Mercantil y Empresa</option>
                        <option value="Otra Consulta">Otra Consulta</option>
                      </select>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Describe brevemente tu consulta:</label>
                    <textarea 
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Indica de forma confidencial los detalles principales de tu asunto judicial..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                    ></textarea>
                  </div>

                  {/* Privacy checkbox */}
                  <div className="space-y-1.5">
                    <label className="flex items-start cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={formData.privacidad}
                        onChange={(e) => setFormData({ ...formData, privacidad: e.target.checked })}
                        className="mt-1 mr-3 rounded border-slate-300 text-amber-500 focus:ring-amber-500 focus:ring-opacity-50"
                      />
                      <span className="text-xs text-slate-500 leading-relaxed">
                        He leído y acepto la política de protección de datos de Aboga2. Consiento expresamente que traten mis datos para agendar la primera consulta legal y enviarme el diagnóstico estratégico de viabilidad de mi caso de acuerdo al RGPD. *
                      </span>
                    </label>
                    {formErrors.privacidad && <p className="text-red-500 text-[10px] font-bold mt-1">{formErrors.privacidad}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 rounded-xl text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Enviar Solicitud de Consulta</span>
                    </button>
                  </div>

                  <div className="text-center text-[10px] text-slate-400">
                    <i className="fa-solid fa-lock text-emerald-500 mr-1.5"></i> Conexión cifrada SSL de seguridad de datos. Cumplimiento estricto del RGPD.
                  </div>

                </form>
              ) : (
                // Contact submission feedback
                <div className="text-center py-12 space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-slate-900">¡Mensaje Enviado Correctamente!</h3>
                    <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                      Muchas gracias, <span className="font-bold text-slate-900">{formData.nombre}</span>. Hemos recibido tu solicitud para el área de <span className="text-amber-600 font-bold">{formData.especialidad}</span>.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto text-xs space-y-1.5 text-left text-slate-600">
                    <p><span className="font-semibold text-slate-900">Compromiso Aboga2:</span> Un abogado colegiado especialista evaluará tu consulta y te llamará al teléfono <span className="text-slate-900 font-mono font-bold">{formData.telefono}</span> en menos de 2 horas laborables.</p>
                  </div>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* CALL TO ACTION BANNER (Screenshot 3 style) */}
      <section className="bg-gradient-to-r from-slate-950 to-slate-900 text-white py-16 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            ¿Tienes un requerimiento o citación judicial urgente?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Nuestros abogados penalistas y procesales civiles están disponibles para asistirle de urgencia en cualquier comisaría, juzgado de guardia o delegación de policía en España. No tomes declaraciones sin defensa cualificada.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a 
              href="https://wa.me/34604065849" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-xl hover:shadow-emerald-500/10"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              <span>Urgencias WhatsApp: +34 604 065 849</span>
            </a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-xl"
            >
              <i className="fa-regular fa-clock"></i>
              <span>Agendar Consulta Inmediata</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER (Hidden on mobile per user specification) */}
      <footer className="hidden md:block bg-slate-950 text-slate-400 py-12 md:py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-900">
            
            {/* Logo and brief brand */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center space-x-3" onClick={() => scrollToSection('inicio')}>
                <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950">
                  <i className="fa-solid fa-scale-balanced text-md"></i>
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-white cursor-pointer">
                  Aboga<span className="text-amber-500">2</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Despacho colectivo de abogados colegiados especializados en las principales ramas jurídicas del derecho penal, de familia y mercantil corporativo en España.
              </p>
              <div className="flex space-x-3 pt-2 text-slate-500">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-500 hover:border-amber-500/40 transition-colors"><i className="fa-brands fa-facebook-f text-xs"></i></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-500 hover:border-amber-500/40 transition-colors"><i className="fa-brands fa-x-twitter text-xs"></i></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-500 hover:border-amber-500/40 transition-colors"><i className="fa-brands fa-linkedin-in text-xs"></i></a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-amber-500 hover:border-amber-500/40 transition-colors"><i className="fa-brands fa-instagram text-xs"></i></a>
              </div>
            </div>

            {/* Quick links columns */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-900 pb-2">Bufete Jurídico</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollToSection('inicio')} className="hover:text-amber-500 transition-colors text-left">Inicio de Sitio</button></li>
                <li><button onClick={() => scrollToSection('nosotros')} className="hover:text-amber-500 transition-colors text-left">Quiénes Somos</button></li>
                <li><button onClick={() => scrollToSection('especialidades')} className="hover:text-amber-500 transition-colors text-left">Áreas de Especialidad</button></li>
                <li><button onClick={() => scrollToSection('faqs')} className="hover:text-amber-500 transition-colors text-left">Preguntas y Dudas</button></li>
                <li><button onClick={() => scrollToSection('contacto')} className="hover:text-amber-500 transition-colors text-left">Oficinas y Contacto</button></li>
              </ul>
            </div>

            {/* Specialties list column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-900 pb-2">Especialidades</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => { setSelectedPracticeArea("penal"); scrollToSection("especialidades"); }} className="hover:text-amber-500 transition-colors text-left">Derecho Penal</button></li>
                <li><button onClick={() => { setSelectedPracticeArea("civil"); scrollToSection("especialidades"); }} className="hover:text-amber-500 transition-colors text-left">Derecho de Familia y Herencias</button></li>
                <li><button onClick={() => { setSelectedPracticeArea("mercantil"); scrollToSection("especialidades"); }} className="hover:text-amber-500 transition-colors text-left">Derecho Mercantil y Startup</button></li>
                <li><button onClick={() => { setSelectedPracticeArea("civil"); scrollToSection("especialidades"); }} className="hover:text-amber-500 transition-colors text-left">Desahucios y Arrendamientos</button></li>
                <li><button onClick={() => { setSelectedPracticeArea("penal"); scrollToSection("especialidades"); }} className="hover:text-amber-500 transition-colors text-left">Juicios Rápidos de Tráfico</button></li>
              </ul>
            </div>

            {/* Quality assurance certification column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-900 pb-2">Certificaciones</h4>
              <div className="space-y-2">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center flex flex-col justify-center items-center">
                  <span className="text-amber-500 text-lg mb-1"><i className="fa-solid fa-gavel"></i></span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-300 font-bold">Colegiados Oficiales</span>
                  <span className="text-[8px] text-slate-500 block">Ilustre Colegio de Abogados</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center flex flex-col justify-center items-center">
                  <span className="text-emerald-400 text-lg mb-1"><i className="fa-solid fa-user-shield"></i></span>
                  <span className="text-[9px] uppercase tracking-wider block text-slate-300 font-bold">100% Confidencial</span>
                  <span className="text-[8px] text-slate-500 block">Secreto Profesional Certificado</span>
                </div>
              </div>
            </div>

          </div>

          {/* Legal bottom row (incorporating requirement copy strictly) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
            <p>
              © 2026 Aboga2 — Demo diseñada por <a href="https://websparaabogados.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 underline">websparaabogados.com</a>. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 text-slate-600">
              <a href="#" className="hover:text-slate-400">Aviso Legal</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-400">Política de Privacidad</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-400">Cookies</a>
            </div>
          </div>

        </div>
      </footer>

      {/* APPOINTMENT BOOKING MODAL (Solicitar Cita Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl relative animate-scale-up">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="flex items-center space-x-3">
                <span className="w-9 h-9 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center text-sm"><i className="fa-regular fa-calendar-check"></i></span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Solicitud de Cita</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Aboga2 | Bufete de Abogados</p>
                </div>
              </div>
            </div>

            {/* Content Form */}
            {!modalSubmitted ? (
              <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Completa el formulario para reservar tu primera sesión de diagnóstico preliminar gratuita en nuestro despacho presencial o por videollamada.
                </p>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">Nombre Completo: *</label>
                  <input 
                    type="text"
                    required
                    value={modalData.nombre}
                    onChange={(e) => setModalData({ ...modalData, nombre: e.target.value })}
                    placeholder="Tu nombre completo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">Teléfono: *</label>
                    <input 
                      type="tel"
                      required
                      value={modalData.telefono}
                      onChange={(e) => setModalData({ ...modalData, telefono: e.target.value })}
                      placeholder="Ej: +34 600 000 000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">Correo Electrónico: *</label>
                    <input 
                      type="email"
                      required
                      value={modalData.email}
                      onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                      placeholder="ejemplo@email.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">Fecha de Preferencia: *</label>
                    <input 
                      type="date"
                      required
                      value={modalData.fecha}
                      onChange={(e) => setModalData({ ...modalData, fecha: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">Hora de Preferencia: *</label>
                    <input 
                      type="time"
                      required
                      value={modalData.hora}
                      onChange={(e) => setModalData({ ...modalData, hora: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">Especialidad Requerida:</label>
                    <select 
                      value={modalData.especialidad}
                      onChange={(e) => setModalData({ ...modalData, especialidad: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Penal">Derecho Penal</option>
                      <option value="Civil y Familia">Derecho Civil y Familia</option>
                      <option value="Mercantil y Empresa">Derecho Mercantil y Empresa</option>
                      <option value="Otro">Otro Asunto Legal</option>
                    </select>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-relaxed">
                  * Indica campos obligatorios. Nos pondremos en contacto contigo en un plazo de 2 horas laborables tras la recepción de este formulario para confirmar la viabilidad de la fecha y hora seleccionada.
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Confirmar Solicitud de Cita</span>
                  </button>
                </div>

              </form>
            ) : (
              // Modal submission success
              <div className="p-10 text-center space-y-6">
                <div className="w-14 h-14 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center text-2xl mx-auto">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-xl font-bold text-slate-900">¡Cita Solicitada con Éxito!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Hola <span className="font-bold text-slate-900">{modalData.nombre}</span>, hemos registrado tu solicitud preliminar de cita para el <span className="font-bold text-slate-900">{modalData.fecha}</span> a las <span className="font-bold text-slate-900">{modalData.hora}</span>.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Te enviaremos un SMS y correo electrónico de confirmación con el enlace de videollamada o los detalles de acceso al despacho en menos de 2h laborables.
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-lg text-xs font-bold"
                >
                  Entendido / Cerrar
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed on mobile with 5 buttons, prominent glowing WhatsApp in the middle) */}
      <nav 
        aria-label="Navegación móvil inferior"
        className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[max(0.4rem,env(safe-area-inset-bottom,0px))]"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-end px-2 pt-1.5 pb-1">
          {/* 1. Inicio */}
          <button
            type="button"
            onClick={() => scrollToSection('inicio')}
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-amber-400 active:scale-95 transition-all focus:outline-none"
          >
            <i className="fa-solid fa-house text-base"></i>
            <span className="text-[10px] font-semibold tracking-tight mt-1">Inicio</span>
          </button>

          {/* 2. Áreas de Práctica */}
          <button
            type="button"
            onClick={() => scrollToSection('especialidades')}
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-amber-400 active:scale-95 transition-all focus:outline-none"
          >
            <i className="fa-solid fa-scale-balanced text-base"></i>
            <span className="text-[10px] font-semibold tracking-tight mt-1">Áreas</span>
          </button>

          {/* 3. WhatsApp (Elevated, larger, constant radiant glowing effect) */}
          <div className="flex items-center justify-center -mt-6 mb-1 relative">
            <a
              href="https://wa.me/34604065849?text=estuve%20viendo%20la%20pagina%20web%20demo%20y%20Tengo%20algunas%20preguntas"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enviar WhatsApp a Aboga2"
              title="WhatsApp"
              className="relative flex items-center justify-center group"
            >
              {/* Constant pulsating halo aura */}
              <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-75 whatsapp-halo-ring pointer-events-none"></span>

              {/* Central glowing circular button */}
              <span className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#4eed82] text-white flex items-center justify-center shadow-xl whatsapp-glow-btn border-2 border-white/50 active:scale-90 transition-transform">
                <i className="fa-brands fa-whatsapp text-3xl drop-shadow-md"></i>
              </span>
            </a>
          </div>

          {/* 4. Test / Diagnóstico */}
          <button
            type="button"
            onClick={() => scrollToSection('evaluador')}
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-amber-400 active:scale-95 transition-all focus:outline-none"
          >
            <i className="fa-solid fa-clipboard-check text-base"></i>
            <span className="text-[10px] font-semibold tracking-tight mt-1">Test Legal</span>
          </button>

          {/* 5. Cita */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-amber-400 active:scale-95 transition-all focus:outline-none"
          >
            <i className="fa-regular fa-calendar-check text-base"></i>
            <span className="text-[10px] font-semibold tracking-tight mt-1">Pedir Cita</span>
          </button>
        </div>
      </nav>

    </div>
  );
}

