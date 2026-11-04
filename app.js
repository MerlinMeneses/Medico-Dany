/**
 * DR. DANY - MÉDICO Y QUIROPRÁCTICO
 * Core Interactive Application Scripts
 */

const WHATSAPP_NUMBER = '5228171180415';

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
    badge: 'Recomendación para Zona Cervical',
    title: 'Ajuste Cervical y Movilización Suave',
    desc: 'Rigidez en cuello, trapecios y dolor de cabeza por tensión o pantallas. Una movilización articular suave ayuda a recuperar el rango de giro y aliviar la pesadez tensional.',
    ctaText: 'Consultar Caso Cervical en WhatsApp',
    waMessage: 'Hola Dr. Dany, sufro de dolor en el cuello y cabeza (zona cervical) y quiero una valoración.'
  },
  dorsal: {
    badge: 'Recomendación para Espalda Media',
    title: 'Alineación Torácica y Liberación Muscular',
    desc: 'Sensación de nudo o molestia punzante entre los omóplatos por sobrecarga postural. Combinamos alineación torácica con descarga de puntos gatillo.',
    ctaText: 'Consultar Caso Dorsal en WhatsApp',
    waMessage: 'Hola Dr. Dany, tengo dolor constante entre los omóplatos y espalda media, quisiera agendar una consulta.'
  },
  lumbar: {
    badge: 'Recomendación para Espalda Baja',
    title: 'Descompresión Lumbar y Alineación Articular',
    desc: 'Molestia al agacharse, levantarse o permanecer sentado. Mediante descompresión e impulsos controlados restauramos el equilibrio y descanso de tu cintura.',
    ctaText: 'Consultar Caso Lumbar en WhatsApp',
    waMessage: 'Hola Dr. Dany, presento dolor en la espalda baja/cintura y requiero atención quiropráctica.'
  },
  ciatica: {
    badge: 'Recomendación para Zona Lumbar y Pierna',
    title: 'Atención de Ciática y Descompresión',
    desc: 'Adormecimiento, ardor o punzada que baja hacia el glúteo y la pierna. Aplicamos maniobras suaves para descomprimir la zona y relajar la musculatura.',
    ctaText: 'Consultar Caso en WhatsApp',
    waMessage: 'Hola Dr. Dany, presento molestia lumbar y en la pierna, requiero cita de valoración.'
  },
  general: {
    badge: 'Recomendación para Tensión General',
    title: 'Ajuste Integral y Descarga Muscular',
    desc: 'Ideal para personas con tensión acumulada, fatiga postural o sobrecarga por ejercicio. Evaluación completa para recuperar ligereza y movilidad.',
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
    
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(data.waMessage)}`;
    btnEl.setAttribute('href', waUrl);
    btnEl.setAttribute('target', '_blank');
  }
};

/* ----------------------------------------------------
   5. SERVICES MODAL POPUP
---------------------------------------------------- */
const serviceModalDetails = {
  'ajuste-columna': {
    title: 'Ajuste Integral de Columna',
    subtitle: 'Restaura el eje natural y la movilidad de tu cuerpo',
    icon: 'fa-solid fa-arrows-to-dot',
    description: 'La mala postura y bloqueos vertebrales generan tensión muscular y fatiga física. Mediante maniobras manuales controladas, favorecemos la movilidad articular para liberar la presión acumulada.',
    benefits: [
      'Alivio y ligereza en toda la columna',
      'Descompresión de nervios y articulaciones',
      'Mejora la postura y rango de movimiento',
      'Protocolo adaptado a tu condición'
    ],
    duration: '45 a 60 minutos',
    recommendation: 'Asistir con ropa cómoda (pants o ropa deportiva).',
    waMsg: 'Hola Dr. Dany, me interesa agendar el servicio de Ajuste Integral de Columna.'
  },
  'ciatica-lumbar': {
    title: 'Alivio de Ciática y Lumbalgia',
    subtitle: 'Manejo médico conservador y descompresión suave',
    icon: 'fa-solid fa-bolt-lightning',
    description: 'La sobrecarga en la región lumbar puede generar dolor irradiado hacia glúteo y pierna. Como médico, el Dr. Dany evalúa tu caso y aplica descompresión manual para aliviar la molestia.',
    benefits: [
      'Disminución del dolor, ardor y entumecimiento',
      'Técnicas manuales seguras y no invasivas',
      'Recuperación de la movilidad al caminar y descansar',
      'Pautas para prevenir recaídas'
    ],
    duration: '45 minutos',
    recommendation: 'Si cuentas con radiografía o resonancia previa, tráela a consulta.',
    waMsg: 'Hola Dr. Dany, quiero agendar cita para valoración de molestia lumbar / ciática.'
  },
  'cervicalgia': {
    title: 'Ajuste Cervical y Cuello',
    subtitle: 'Libera la tensión por estrés y trabajo frente a pantallas',
    icon: 'fa-solid fa-head-side-virus',
    description: 'El uso continuo de computadoras o celular genera rigidez en cuello y trapecios. Este protocolo busca relajar los tejidos suboccipitales y movilizar vértebras cervicales suavemente.',
    benefits: [
      'Alivio de tensión en nuca y dolor de cabeza',
      'Mayor soltura y rango de giro en el cuello',
      'Menos pesadez sobre hombros y espalda alta',
      'Sensación de descanso postural'
    ],
    duration: '40 a 50 minutos',
    recommendation: 'Evitar collares o accesorios metálicos al asistir a la cita.',
    waMsg: 'Hola Dr. Dany, quisiera agendar consulta para tensión de cuello y cabeza.'
  },
  'descarga-muscular': {
    title: 'Descarga Muscular Miofascial',
    subtitle: 'Eliminación profunda de contracturas y sobrecarga física',
    icon: 'fa-solid fa-dumbbell',
    description: 'Terapia que combina técnicas manuales profundas y estiramientos pasivos para relajar bandas musculares en tensión. Ideal para deportistas o personas bajo estrés laboral.',
    benefits: [
      'Eliminación de contracturas dolorosas',
      'Estimula la microcirculación y oxigenación',
      'Mayor flexibilidad y ligereza muscular',
      'Acelera la recuperación física'
    ],
    duration: '50 a 60 minutos',
    recommendation: 'Mantenerte bien hidratado antes y después de la sesión.',
    waMsg: 'Hola Dr. Dany, me interesa agendar una sesión de descarga muscular.'
  },
  'valoracion-medica': {
    title: 'Valoración Médica con Radiografías',
    subtitle: 'El respaldo de un diagnóstico médico para tu tranquilidad',
    icon: 'fa-solid fa-x-ray',
    description: 'Antes de realizar cualquier maniobra, la seguridad es prioridad. El Dr. Dany realiza pruebas de movilidad, reflejos neurológicos y una lectura detallada de tus estudios de imagen.',
    benefits: [
      'Evaluación clínica con cédula profesional de médico',
      'Explicación clara de tus radiografías o resonancias',
      'Detección de causas reales y descarte de riesgos',
      'Plan de atención individualizado y responsable'
    ],
    duration: '45 minutos',
    recommendation: 'Traer estudios de imagen en físico o digital si cuentas con ellos.',
    waMsg: 'Hola Dr. Dany, requiero una valoración médica integral con análisis de mis radiografías.'
  },
  'postura-ergonomia': {
    title: 'Reeducación Postural',
    subtitle: 'Aprende a proteger tu columna y consolidar tu bienestar',
    icon: 'fa-solid fa-person-walking',
    description: 'Alinearse en el consultorio es el primer paso; los hábitos cotidianos mantienen los resultados. Te orientamos con rutinas ergonómicas y ejercicios de fortalecimiento.',
    benefits: [
      'Seguimiento preventivo para evitar recaídas',
      'Consejos ergonómicos para tu puesto de trabajo',
      'Ejercicios clave de movilidad para realizar en casa',
      'Mayor energía y confort corporal continuo'
    ],
    duration: '40 minutos',
    recommendation: 'Venir con ropa cómoda para realizar pruebas de movimiento.',
    waMsg: 'Hola Dr. Dany, me gustaría recibir asesoría de reeducación postural.'
  },
  'medicina-general': {
    title: 'Consulta Médica General',
    subtitle: 'Atención primaria y diagnóstico clínico profesional',
    icon: 'fa-solid fa-user-doctor',
    description: 'Evaluación integral de salud realizada por Médico General con Cédula Profesional. Diagnóstico de enfermedades agudas o crónicas, control de signos vitales, recetas médicas y seguimiento responsable.',
    benefits: [
      'Valoración clínica rigurosa y trato humano',
      'Diagnóstico oportuno de enfermedades comunes',
      'Control de presión, glucosa y estado general',
      'Prescripción y orientación farmacológica certera'
    ],
    duration: '35 a 45 minutos',
    recommendation: 'Traer historial o medicamentos que tomes actualmente.',
    waMsg: 'Hola Dr. Dany, quisiera agendar una consulta médica general.'
  },
  'homeopatia': {
    title: 'Homeopatía Clínica',
    subtitle: 'Terapéutica médica natural y suave para tu organismo',
    icon: 'fa-solid fa-leaf',
    description: 'Enfoque complementario que busca estimular el sistema inmunológico y la capacidad curativa propia del cuerpo. Basada en el principio de similitud y sustancias dinámicas no tóxicas.',
    benefits: [
      'Tratamiento libre de efectos secundarios agresivos',
      'Atención al origen emocional y físico de la dolencia',
      'Complemento ideal para defensas y problemas crónicos',
      'Apto para niños, adultos y personas sensibles'
    ],
    duration: '45 minutos',
    recommendation: 'Comentar al Dr. cualquier tratamiento complementario en curso.',
    waMsg: 'Hola Dr. Dany, me interesa agendar una consulta de Homeopatía Clínica.'
  },
  'medicina-alternativa': {
    title: 'Medicina Alternativa e Integrativa',
    subtitle: 'Bienestar holístico y armonía cuerpo-mente',
    icon: 'fa-solid fa-spa',
    description: 'Abordaje integral que combina terapias naturales, fitoterapia, equilibrio neuromuscular y hábitos de vida saludables con el criterio científico de un médico general.',
    benefits: [
      'Desintoxicación y revitalización energética corporal',
      'Disminución del estrés, insomnio y agotamiento',
      'Uso de opciones naturales con respaldo y seguridad',
      'Tratamiento integral enfocado en la raíz del malestar'
    ],
    duration: '45 a 60 minutos',
    recommendation: 'Venir con mente abierta y disposición para mejorar tu estilo de vida.',
    waMsg: 'Hola Dr. Dany, deseo información y cita para Medicina Alternativa e Integrativa.'
  }
};

window.openServiceModal = function(serviceKey) {
  const item = serviceModalDetails[serviceKey];
  if (!item) return;

  const modal = document.getElementById('service-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const benefitsList = item.benefits.map(b => `<li><i class="fa-solid fa-circle-check text-emerald"></i> ${b}</li>`).join('');
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(item.waMsg)}`;

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

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;

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
