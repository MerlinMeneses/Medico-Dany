/**
 * DR. DANY - MÉDICO Y QUIROPRÁCTICO
 * Core Interactive Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initNumberCounters();
  initFaqAccordion();
  setCurrentYear();
});

/* ----------------------------------------------------
   1. NAVIGATION & MOBILE DRAWER
---------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileClose = document.getElementById('mobile-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close drawer when clicking any link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Highlight active link while scrolling
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }
}

/* ----------------------------------------------------
   2. SCROLL REVEAL ANIMATIONS
---------------------------------------------------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-fade');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ----------------------------------------------------
   3. ANIMATED NUMBER COUNTERS
---------------------------------------------------- */
function initNumberCounters() {
  const stats = document.querySelectorAll('.stat-number');
  let started = false;

  const statsSection = document.querySelector('.hero-stats-row');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      stats.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 1800; // ms
        const stepTime = 25;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            counter.innerText = Math.floor(current);
          }
        }, stepTime);
      });
    }
  }, { threshold: 0.5 });

  observer.observe(statsSection);
}

/* ----------------------------------------------------
   4. INTERACTIVE SYMPTOM CHECKER / QUIZ
---------------------------------------------------- */
const symptomData = {
  cervical: {
    badge: 'Recomendación para Zona Cervical y Cabeza',
    title: 'Ajuste Cervical Suave y Descompresión C1-C7',
    desc: 'El dolor en el cuello, contractura en trapecios y dolores de cabeza tensionales suelen deberse a subluxación en vértebras cervicales por mala postura o estrés. El Dr. Dany realiza una valoración de rango de rotación y un ajuste controlado que devuelve la ligereza instantánea.',
    ctaText: 'Consultar Caso Cervical en WhatsApp',
    waMessage: 'Hola Dr. Dany, sufro de dolor en el cuello y cabeza (zona cervical) y quiero una valoración.'
  },
  dorsal: {
    badge: 'Recomendación para Espalda Media y Omóplatos',
    title: 'Alineación Torácica y Liberación Costovertebral',
    desc: 'La sensación de "nudo" punzante entre los omóplatos o dificultad para respirar hondo proviene comúnmente de bloqueos en la columna dorsal y contractura miofascial. Combinamos descompresión de caja torácica con descarga de puntos gatillo.',
    ctaText: 'Consultar Caso Dorsal en WhatsApp',
    waMessage: 'Hola Dr. Dany, tengo dolor constante entre los omóplatos y espalda media, quisiera agendar una consulta.'
  },
  lumbar: {
    badge: 'Recomendación para Espalda Baja y Cintura',
    title: 'Descompresión Lumbar L1-L5 y Alineación Sacroilíaca',
    desc: 'El dolor punzante al agacharse, pararse o levantarse de la cama indica una desalineación de la pelvis o sobrecarga de discos lumbares. Mediante técnicas de tracción médica e impulsos específicos se restablece el equilibrio de tu cintura.',
    ctaText: 'Consultar Caso Lumbar en WhatsApp',
    waMessage: 'Hola Dr. Dany, presento dolor agudo en la espalda baja/cintura y requiero atención quiropráctica.'
  },
  ciatica: {
    badge: 'Recomendación para Zona Lumbar y Pierna',
    title: 'Atención Biomecánica para Zona Lumbar y Pierna',
    desc: 'El adormecimiento, punzada o ardor que corre desde el glúteo por la pierna suele asociarse a sobrecarga o compresión mecánica lumbar. Nuestro abordaje manual busca descomprimir la zona y relajar la musculatura mediante técnicas conservadoras no invasivas.',
    ctaText: 'Consultar Caso en WhatsApp',
    waMessage: 'Hola Dr. Dany, presento molestia lumbar y en la pierna, requiero cita de valoración.'
  },
  general: {
    badge: 'Recomendación para Tensión General y Postura',
    title: 'Ajuste Integral de Columna y Descarga Miofascial',
    desc: 'Ideal para quienes pasan horas sentados, deportistas o personas que sienten el cuerpo pesado o desbalanceado. Realizamos una evaluación articular de columna para favorecer tu equilibrio corporal y bienestar.',
    ctaText: 'Agendar Valoración en WhatsApp',
    waMessage: 'Hola Dr. Dany, me siento tenso y desalineado, quiero agendar una consulta de valoración.'
  }
};

window.selectSymptomZone = function(zoneKey) {
  const data = symptomData[zoneKey];
  if (!data) return;

  // Update button active states
  const buttons = document.querySelectorAll('.symptom-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-zone') === zoneKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Result Card
  const badgeEl = document.getElementById('result-badge');
  const titleEl = document.getElementById('result-title');
  const descEl = document.getElementById('result-desc');
  const btnEl = document.getElementById('symptom-book-btn');

  if (badgeEl && titleEl && descEl && btnEl) {
    badgeEl.innerText = data.badge;
    titleEl.innerText = data.title;
    descEl.innerText = data.desc;
    btnEl.innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${data.ctaText}`;
    
    const waUrl = `https://wa.me/5213300000000?text=${encodeURIComponent(data.waMessage)}`;
    btnEl.setAttribute('href', waUrl);
    btnEl.setAttribute('target', '_blank');
  }
};

/* ----------------------------------------------------
   5. SERVICES MODAL POPUP
---------------------------------------------------- */
const serviceModalDetails = {
  'ajuste-columna': {
    title: 'Ajuste y Alineación Integral de Columna',
    subtitle: 'El tratamiento enfocado en favorecer el eje natural de tu cuerpo',
    icon: 'fa-solid fa-arrows-to-dot',
    description: 'La subluxación vertebral y la mala postura pueden generar tensión muscular e incomodidad general. Mediante maniobras manuales cuidadosas y controladas, favorecemos la movilidad articular para liberar la presión acumulada.',
    benefits: [
      'Sensación de alivio y ligereza corporal',
      'Movilización y alineación articular de columna',
      'Favorece la postura y el confort físico',
      'Protocolos adaptados a cada paciente'
    ],
    duration: '45 a 60 minutos por sesión',
    recommendation: 'Llevar ropa cómoda (pants o playera de algodón).',
    waMsg: 'Hola Dr. Dany, me interesa agendar el servicio de Ajuste Integral de Columna.'
  },
  'ciatica-lumbar': {
    title: 'Atención de Molestias Lumbares y Trayecto Ciático',
    subtitle: 'Manejo conservador y descompresión biomecánica suave',
    icon: 'fa-solid fa-bolt-lightning',
    description: 'La tensión en la región lumbar puede generar molestias irradiadas hacia el glúteo y extremidad inferior. Como médico, el Dr. Dany evalúa tu rango neurológico y aplica maniobras manuales suaves para favorecer la descompresión mecánica.',
    benefits: [
      'Disminución progresiva de la tensión y ardor en glúteo y pierna',
      'Terapia manual conservadora no invasiva',
      'Recuperación de la movilidad funcional al caminar y agacharse',
      'Orientación postural preventiva'
    ],
    duration: '45 minutos',
    recommendation: 'Si cuentas con radiografía o resonancia lumbar previa, tráela a consulta.',
    waMsg: 'Hola Dr. Dany, quiero agendar cita para valoración de molestia lumbar / ciática.'
  },
  'cervicalgia': {
    title: 'Ajuste Cervical, Cuello y Tensión Craneal',
    subtitle: 'Libera la sobrecarga del estrés y el trabajo en computadora',
    icon: 'fa-solid fa-head-side-virus',
    description: 'La postura continua frente a pantallas provoca rigidez en trapecios y cuello. Este protocolo busca relajar los tejidos suboccipitales y movilizar vértebras cervicales de forma suave.',
    benefits: [
      'Alivio y disminución de la tensión en cabeza y nuca',
      'Mayor soltura y rango de movimiento al girar el cuello',
      'Alivio de la sensación de pesadez sobre los hombros',
      'Sensación de ligereza y descanso postural'
    ],
    duration: '40 a 50 minutos',
    recommendation: 'Evitar collares o accesorios metálicos al asistir a la cita.',
    waMsg: 'Hola Dr. Dany, quisiera agendar consulta para tensión de cuello y cabeza.'
  },
  'descarga-muscular': {
    title: 'Terapia Miofascial y Descarga Muscular Profunda',
    subtitle: 'Disolución de puntos de tensión y sobrecarga muscular',
    icon: 'fa-solid fa-dumbbell',
    description: 'Terapia que combina técnicas manuales profundas y estiramientos pasivos para relajar las bandas musculares en tensión. Recomendado para deportistas o personas bajo sobrecarga física.',
    benefits: [
      'Disminución de contracturas y tensión acumulada en la espalda',
      'Favorece la microcirculación y oxigenación tisular',
      'Mayor flexibilidad y rango de movimiento',
      'Acompañamiento en la recuperación física de actividades intensas'
    ],
    duration: '50 a 60 minutos',
    recommendation: 'Hidratarse bien antes y después de la sesión.',
    waMsg: 'Hola Dr. Dany, me interesa agendar una sesión de descarga muscular y puntos miofasciales.'
  },
  'valoracion-medica': {
    title: 'Valoración Médica Completa y Análisis Radiológico',
    subtitle: 'El respaldo de un médico general para tu tranquilidad',
    icon: 'fa-solid fa-x-ray',
    description: 'Antes de realizar cualquier manipulación manual, la seguridad y el diagnóstico son prioridad. El Dr. Dany realiza pruebas ortopédicas de movilidad, reflejos y lectura cuidadosa de tus estudios radiográficos.',
    benefits: [
      'Evaluación clínica con cédula profesional de médico',
      'Interpretación y explicación clara de tus estudios de imagen',
      'Detección de desviaciones, postura y contraindicaciones',
      'Plan de atención individualizado y responsable'
    ],
    duration: '45 minutos',
    recommendation: 'Traer estudios radiográficos o de resonancia recientes en físico o digital.',
    waMsg: 'Hola Dr. Dany, requiero una valoración médica integral con análisis de mis radiografías.'
  },
  'postura-ergonomia': {
    title: 'Reeducación Postural y Prevención Biomecánica',
    subtitle: 'Aprende a cuidar tu columna y mantener tu bienestar',
    icon: 'fa-solid fa-person-walking',
    description: 'Alinearse en el consultorio es un gran paso; el cuidado continuo en tu vida diaria consolida los resultados. Te orientamos con rutinas ergonómicas para sentarte, agacharte y fortalecer tu musculatura de soporte.',
    benefits: [
      'Seguimiento preventivo para consolidar tus ajustes',
      'Guía personalizada de ergonomía para tu trabajo o actividades',
      'Ejercicios clave de movilidad y fortalecimiento lumbar y cervical',
      'Fomento de hábitos saludables y confort físico constante'
    ],
    duration: '40 minutos',
    recommendation: 'Venir con ropa deportiva para realizar pruebas dinámicas.',
    waMsg: 'Hola Dr. Dany, me gustaría recibir asesoría de reeducación postural y movilidad de columna.'
  }
};

window.openServiceModal = function(serviceKey) {
  const item = serviceModalDetails[serviceKey];
  if (!item) return;

  const modal = document.getElementById('service-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const benefitsList = item.benefits.map(b => `<li><i class="fa-solid fa-circle-check text-emerald"></i> ${b}</li>`).join('');
  const waUrl = `https://wa.me/5213300000000?text=${encodeURIComponent(item.waMsg)}`;

  content.innerHTML = `
    <div class="modal-header-box">
      <div class="service-icon-box" style="margin-bottom: 1rem;">
        <i class="${item.icon}"></i>
      </div>
      <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: #ffffff; margin-bottom: 0.3rem;">${item.title}</h3>
      <p style="color: var(--primary); font-size: 0.95rem; font-weight: 600; margin-bottom: 1.4rem;">${item.subtitle}</p>
    </div>
    
    <div class="modal-body-box" style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.8rem;">
      <p style="margin-bottom: 1.2rem;">${item.description}</p>
      
      <h4 style="color: #ffffff; font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.8rem;">
        <i class="fa-solid fa-star text-gold"></i> Beneficios Principales:
      </h4>
      <ul style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.4rem;">
        ${benefitsList}
      </ul>

      <div style="background: rgba(255,255,255,0.04); padding: 1rem 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 1.5rem;">
        <p style="font-size: 0.88rem; margin-bottom: 0.3rem;"><strong><i class="fa-solid fa-clock text-blue"></i> Duración estimada:</strong> ${item.duration}</p>
        <p style="font-size: 0.88rem;"><strong><i class="fa-solid fa-circle-info text-primary"></i> Recomendación:</strong> ${item.recommendation}</p>
      </div>
    </div>

    <div class="modal-footer-box" style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="flex: 1;">
        <i class="fa-brands fa-whatsapp"></i> Agendar Este Servicio
      </a>
      <button class="btn btn-outline" onclick="closeServiceModalDirect()">
        Cerrar
      </button>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeServiceModal = function(event) {
  const modal = document.getElementById('service-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.closeServiceModalDirect = function() {
  const modal = document.getElementById('service-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

/* ----------------------------------------------------
   6. FAQ ACCORDION
---------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherQuestion = other.querySelector('.faq-question');
          const otherAnswer = other.querySelector('.faq-answer');
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      } else {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ----------------------------------------------------
   7. FORM SUBMISSION TO WHATSAPP
---------------------------------------------------- */
window.handleFormSubmit = function(event) {
  event.preventDefault();

  const form = document.getElementById('appointment-form');
  const name = form.patientName.value.trim();
  const phone = form.patientPhone.value.trim();
  const city = form.patientCity.value.trim() || 'No especificada';
  const service = form.patientService.value;
  const date = form.patientDate.value || 'Por acordar';
  const time = form.patientTime.value;
  const symptoms = form.patientSymptoms.value.trim() || 'No especificado';

  if (!name || !phone || !service) {
    alert('Por favor completa todos los campos requeridos (*)');
    return;
  }

  // Construct structured WhatsApp Message
  const textMessage = 
`🩺 *SOLICITUD DE CITA - DR. DANY*
-----------------------------------
👤 *Paciente:* ${name}
📱 *Teléfono:* ${phone}
📍 *Ciudad / Zona:* ${city}
💆‍♂️ *Servicio solicitado:* ${service}
📅 *Fecha preferida:* ${date}
⏰ *Horario preferido:* ${time}
📝 *Motivo / Síntomas:* ${symptoms}
-----------------------------------
_Mensaje generado desde el sitio web oficial del Dr. Dany_`;

  const waUrl = `https://wa.me/5213300000000?text=${encodeURIComponent(textMessage)}`;

  // Show visual feedback
  const submitBtn = document.getElementById('submit-form-btn');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Redirigiendo a WhatsApp...`;
  submitBtn.disabled = true;

  setTimeout(() => {
    window.open(waUrl, '_blank');
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
    form.reset();
  }, 600);
};

/* ----------------------------------------------------
   8. CURRENT YEAR IN FOOTER
---------------------------------------------------- */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.innerText = new Date().getFullYear();
  }
}
