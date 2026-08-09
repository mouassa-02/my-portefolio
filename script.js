/**
 * Moussa SAYAH — Portfolio Engine & Interactive Logic
 * Constellation Starfield, Custom Cursor, Case Study Dialogs, Web Audio FX & Theme System
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Année Actuelle Automatique
  const yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Moteur Audio Web Audio API (Micro-clics de luxe)
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function playLuxuryClick(freq = 580, type = "sine") {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === "suspended") audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Fallback silencieux
    }
  }

  const soundToggleBtn = document.getElementById("soundToggle");
  const soundIcon = document.getElementById("soundIcon");
  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
      showToast(soundEnabled ? "Effets sonores activés" : "Mode silencieux activé");
      if (soundEnabled) playLuxuryClick(700);
    });
  }

  // 3. Canvas Constellation Particules
  const canvas = document.getElementById("starfieldCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 75);

    const mouse = { x: width / 2, y: height / 2 };

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? `rgba(161, 116, 16, ${this.alpha * 0.7})` : `rgba(245, 215, 127, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateStarfield() {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute("data-theme") === "light";

      // Dessiner particules & connexions
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isLight ? `rgba(161, 116, 16, ${0.15 * (1 - dist / 120)})` : `rgba(212, 175, 55, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateStarfield);
    }
    animateStarfield();
  }

  // 4. Curseur Personnalisé & Boutons Magnétiques
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    renderCursorRing();

    // Effet Hover sur liens/boutons
    const hoverTargets = document.querySelectorAll("a, button, .tilt-card, .pill-btn");
    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
        playLuxuryClick(800);
      });
      target.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
      });
    });
  }

  // 5. Header Scroll Glassmorphic & Toggle Nav Mobile
  const header = document.querySelector("[data-header]");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("is-scrolled");
    } else {
      header?.classList.remove("is-scrolled");
    }
  });

  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");

  function closeNavPanel() {
    if (navPanel?.classList.contains("is-open")) {
      navToggle?.setAttribute("aria-expanded", "false");
      navPanel.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  navToggle?.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    navPanel?.classList.toggle("is-open");
    document.body.style.overflow = !isExpanded ? "hidden" : "";
    playLuxuryClick(600);
  });

  // Fermer le menu mobile lors du clic sur un lien
  document.querySelectorAll(".nav__link, .nav__actions a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNavPanel();
    });
  });

  // Fermer sur appui de la touche Échap ou clic extérieur
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNavPanel();
  });

  document.addEventListener("click", (e) => {
    if (
      navPanel?.classList.contains("is-open") &&
      !navPanel.contains(e.target) &&
      !navToggle?.contains(e.target)
    ) {
      closeNavPanel();
    }
  });

  // 6. Scroll Reveal Observer
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // 7. Compteurs Statistiques Animés
  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.closest("[data-count]");
          const targetNum = parseInt(parent?.getAttribute("data-count") || "0", 10);
          let current = 0;
          const step = Math.max(1, Math.floor(targetNum / 40));

          const timer = setInterval(() => {
            current += step;
            if (current >= targetNum) {
              entry.target.textContent = targetNum.toString();
              clearInterval(timer);
            } else {
              entry.target.textContent = current.toString();
            }
          }, 35);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  // 8. Filtrage des Projets par Catégorie
  const filterBtns = document.querySelectorAll("[data-filter-bar] button");
  const projectCards = document.querySelectorAll("[data-projects-grid] .project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.getAttribute("data-filter");
      playLuxuryClick(650);

      projectCards.forEach((card) => {
        const cat = card.getAttribute("data-category") || "";
        if (filter === "all" || cat.includes(filter)) {
          card.style.display = "block";
          setTimeout(() => (card.style.opacity = "1"), 50);
        } else {
          card.style.opacity = "0";
          setTimeout(() => (card.style.display = "none"), 300);
        }
      });
    });
  });

  // 9. Modales Détaillées d'Études de Cas (<dialog>)
  const caseStudyData = {
    nexus: {
      title: "Plateforme Nexus AI Analytics",
      category: "Full-Stack • SaaS & IA",
      metrics: [
        { label: "Latence Médiane", val: "28 ms" },
        { label: "Volume Traité", val: "4.2M requêtes/jour" },
        { label: "Gain de Conversion", val: "+140%" },
      ],
      desc: "Système de télémétrie décisionnelle d'entreprise conçu pour les décideurs stratégiques. Traitement en temps réel des données de performance, modèles de prédiction ML et interface en verre obsidian ultra-fluide.",
      stack: ["Next.js 14", "TypeScript", "Node.js", "GraphQL", "TailwindCSS", "Recharts"],
      architecture: "Architecture Micro-Services découplée avec pipelines d'ingestion Redis & PostgreSQL. Temps de rendu hybride (SSR + Streaming React Server Components).",
    },
    aura: {
      title: "Moteur E-Commerce Luxe Aura",
      category: "Full-Stack • Haute Couture",
      metrics: [
        { label: "Vitesse de Chargement", val: "0.4s LCP" },
        { label: "Taux de Conversion", val: "+85%" },
        { label: "Panier Moyen", val: "1 450 €" },
      ],
      desc: "Expérience d'achat immersive conçue pour les marques de joaillerie et d'horlogerie de prestige. Intégration de modèles 3D WebGL interactifs, panier instantané sans rechargement et tunnel de paiement Stripe multi-devises.",
      stack: ["React 18", "Three.js / WebGL", "Stripe API", "PostgreSQL", "TailwindCSS"],
      architecture: "Pipeline de rendu 3D optimisé avec compression Draco, synchronisation d'inventaire temps réel et architecture Headless e-commerce.",
    },
    vanguard: {
      title: "Vanguard Banque Digitale & Crypto",
      category: "Fintech & Web3",
      metrics: [
        { label: "Sécurité", val: "Conforme SOC2 & ISO27001" },
        { label: "Mise à jour Prix", val: "50 ms WebSockets" },
        { label: "Disponibilité", val: "99.99%" },
      ],
      desc: "Portail bancaire privé et plateforme d'arbitrage cryptographique pour clients VIP. Visualisation temps réel du portefeuille d'actifs, graphiques boursiers réactifs et coffre-fort de clés chiffrées.",
      stack: ["Vue 3", "TypeScript", "Express.js", "WebSockets", "Docker", "Redis"],
      architecture: "Communication bidirectionnelle WebSockets avec chiffrement de bout en bout AES-256 et base de données distribuée hautement disponible.",
    },
    pulse: {
      title: "Pulse Automation de Workflows",
      category: "Cloud Architecture & Automation",
      metrics: [
        { label: "Gain de Temps Équipe", val: "35h / semaine" },
        { label: "Tâches Exécutées", val: "1.8M / mois" },
        { label: "Stabilité Pipeline", val: "100%" },
      ],
      desc: "Constructeur visuel de pipelines d'automatisation d'entreprise. Permet aux ingénieurs de concevoir des flux de travail complexes par glisser-déposer de nœuds réactifs.",
      stack: ["React Flow", "Node.js", "Python (FastAPI)", "Redis Queues", "PostgreSQL"],
      architecture: "Exécuteur de tâches asynchrones distribué sur clusters Redis & Celery avec moteur de règles Python managé.",
    },
  };

  const caseDialog = document.getElementById("caseStudyModal");
  const modalContent = document.getElementById("modalDynamicContent");
  const closeModalBtn = document.getElementById("closeModalBtn");

  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-open-modal");
      const data = caseStudyData[key];
      if (!data || !caseDialog) return;

      playLuxuryClick(900);

      modalContent.innerHTML = `
        <span class="section-tag">${data.category}</span>
        <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin: 8px 0 20px 0;">${data.title}</h2>
        <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 28px;">${data.desc}</p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px; border: 1px solid var(--border-gold);">
          ${data.metrics
          .map(
            (m) => `
            <div>
              <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--gold-light);">${m.val}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${m.label}</div>
            </div>
          `
          )
          .join("")}
        </div>

        <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 10px;">Architecture Technique</h3>
        <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 24px;">${data.architecture}</p>

        <h3 style="font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 12px;">Stack de Développement</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px;">
          ${data.stack.map((s) => `<span style="padding: 6px 14px; border-radius: 8px; background: rgba(212,175,55,0.12); color: var(--gold-light); font-size: 0.82rem;">${s}</span>`).join("")}
        </div>

        <div style="display: flex; gap: 16px;">
          <a href="#contact" onclick="document.getElementById('caseStudyModal').close();" class="btn btn--gold-filled" style="flex: 1; text-align: center;">Demander une Démo Privée</a>
        </div>
      `;

      caseDialog.showModal();
    });
  });

  closeModalBtn?.addEventListener("click", () => {
    caseDialog?.close();
    playLuxuryClick(400);
  });

  caseDialog?.addEventListener("click", (e) => {
    if (e.target === caseDialog) caseDialog.close();
  });

  // 10. Copie d'Email avec Toast Notification
  const copyBtn = document.getElementById("copyEmailBtn");
  const emailLink = document.getElementById("contactEmail");

  copyBtn?.addEventListener("click", () => {
    const email = emailLink?.textContent || "moussa.sayah021984@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      showToast("Adresse email copiée dans le presse-papier ! ✦");
      playLuxuryClick(1000);
    });
  });

  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  // 11. Gestionnaire de Thème (Dark / Light)
  const themeToggleBtn = document.querySelector("[data-theme-toggle]");
  const themeIcon = document.querySelector("[data-theme-icon]");

  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (themeIcon) themeIcon.textContent = savedTheme === "dark" ? "🌙" : "☀️";

  themeToggleBtn?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (themeIcon) themeIcon.textContent = nextTheme === "dark" ? "🌙" : "☀️";

    showToast(`Thème ${nextTheme === "dark" ? "Obsidian Dark" : "Porcelain Light"} activé`);
    playLuxuryClick(750);
  });

  // 12. Soumission du Formulaire de Contact via Service Email (FormSubmit API)
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // Adresse email destinataire (facilement modifiable)
  const DESTINATION_EMAIL = "moussa.sayah021984@gmail.com";

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    playLuxuryClick(950);

    const submitBtn = contactForm.querySelector("button[type='submit']");
    const name = document.getElementById("userName")?.value.trim();
    const email = document.getElementById("userEmail")?.value.trim();
    const message = document.getElementById("userMessage")?.value.trim();
    const budgetEl = contactForm.querySelector('input[name="budget"]:checked');
    const budget = budgetEl ? budgetEl.value : "Non précisé";

    if (!name || !email || !message) {
      if (formStatus) {
        formStatus.style.color = "#ff6b6b";
        formStatus.textContent = "⚠️ Veuillez remplir tous les champs requis.";
      }
      return;
    }

    // État de chargement visuel du bouton
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";
      submitBtn.innerHTML = `<span>Envoi en cours...</span>`;
    }

    if (formStatus) {
      formStatus.style.color = "var(--gold-light)";
      formStatus.textContent = "✦ Transmissions des données en cours...";
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `📩 Nouvelle demande de projet de : ${name}`,
          _template: "table",
          "Nom & Prénom": name,
          "Email du Client": email,
          "Budget Proposé": budget,
          "Détails du Projet": message
        })
      });

      const result = await response.json();

      if (response.ok && result.success !== "false") {
        if (formStatus) {
          formStatus.style.color = "var(--gold-light)";
          formStatus.textContent = "✦ Demande transmise avec succès ! Moussa SAYAH vous répondra sous 24h.";
        }
        contactForm.reset();
        showToast("Votre message a été transmis directement par email !");
        playLuxuryClick(1100);
      } else {
        throw new Error(result.message || "Erreur de transmission");
      }
    } catch (err) {
      console.error("Erreur envoi email:", err);
      if (formStatus) {
        formStatus.style.color = "#ff6b6b";
        formStatus.textContent = "❌ Impossible d'envoyer la demande. Veuillez envoyer un email direct à " + DESTINATION_EMAIL;
      }
      showToast("Erreur lors de l'envoi de la demande");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
});

