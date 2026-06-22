document.documentElement.classList.add("js");

const progressBar = document.querySelector("#scrollProgress");
const updateProgress = () => {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
};

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

const stickyCta = document.querySelector(".mobile-sticky-cta");
const siteHeader = document.querySelector(".site-header");
const applySection = document.querySelector("#bewerbung");
const finalCta = document.querySelector(".final-cta");
const teamVideoSection = document.querySelector(".team-video-section");
const jobsSection = document.querySelector(".jobs-section");
const legalSection = document.querySelector(".legal-section");
if (stickyCta && "IntersectionObserver" in window) {
  const stickyHiddenSections = new Set();
  const stickyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyHiddenSections.add(entry.target);
        } else {
          stickyHiddenSections.delete(entry.target);
        }
      });
      stickyCta.classList.toggle("is-hidden", stickyHiddenSections.size > 0);
    },
    { threshold: 0.05 }
  );

  [siteHeader, teamVideoSection, jobsSection, applySection, finalCta, legalSection].forEach(section => {
    if (section) stickyObserver.observe(section);
  });
}

document.querySelectorAll(".task-detail").forEach(detail => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".task-detail").forEach(other => {
      if (other !== detail) other.open = false;
    });
  });
});

const privacyDetails = document.querySelector("#bewerbungsdatenschutz");
const legalPanels = document.querySelectorAll(".legal-panel");
const openPrivacyFromHash = () => {
  legalPanels.forEach(panel => {
    if (`#${panel.id}` === location.hash) panel.open = true;
  });
  if (location.hash === "#bewerbungsdatenschutz" && privacyDetails) {
    privacyDetails.open = true;
  }
};
openPrivacyFromHash();
window.addEventListener("hashchange", openPrivacyFromHash);

const applyForm = document.querySelector("#applyForm");
const privacyConsent = document.querySelector("#privacyConsent");
const submitButton = document.querySelector("#applySubmit");
const submitGuard = document.querySelector("#submitGuard");
const submitZone = document.querySelector(".submit-zone");
const privacyError = document.querySelector("#privacyError");
const desiredJob = document.querySelector("#desiredJob");
const desiredJobField = document.querySelector("#desiredJobField");
const privacyMessage = "Bitte bestätige zuerst, dass du die Datenschutzhinweise gelesen hast.";

const setPrivacyState = () => {
  const ready = Boolean(privacyConsent?.checked);
  if (submitButton) submitButton.disabled = !ready;
  submitZone?.classList.toggle("is-ready", ready);
  if (ready && privacyError) privacyError.textContent = "";
};

const showPrivacyError = () => {
  if (privacyDetails) privacyDetails.open = true;
  if (privacyError) privacyError.textContent = privacyMessage;
  privacyConsent?.focus({ preventScroll: false });
};

setPrivacyState();
privacyConsent?.addEventListener("change", setPrivacyState);
submitGuard?.addEventListener("click", showPrivacyError);
submitGuard?.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    showPrivacyError();
  }
});

const jobRail = document.querySelector("#jobRail");
const jobCards = Array.from(document.querySelectorAll("[data-job-card]"));
const jobProgress = document.querySelector("#jobProgress");
const jobNavButtons = document.querySelectorAll("[data-job-dir]");
const jobMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let jobSliderTicking = false;

const getActiveJobIndex = () => {
  if (!jobRail || !jobCards.length) return 0;
  const railCenter = jobRail.scrollLeft + jobRail.clientWidth / 2;
  return jobCards.reduce((bestIndex, card, index) => {
    const bestCard = jobCards[bestIndex];
    const currentDistance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - railCenter);
    const bestDistance = Math.abs(bestCard.offsetLeft + bestCard.offsetWidth / 2 - railCenter);
    return currentDistance < bestDistance ? index : bestIndex;
  }, 0);
};

const updateJobSlider = () => {
  jobSliderTicking = false;
  if (!jobRail || !jobCards.length) return;

  const activeIndex = getActiveJobIndex();
  jobCards.forEach((card, index) => {
    card.classList.toggle("is-active", index === activeIndex);
  });

  const maxScroll = Math.max(1, jobRail.scrollWidth - jobRail.clientWidth);
  const progress = Math.max(10, Math.min(100, (jobRail.scrollLeft / maxScroll) * 100));
  if (jobProgress) jobProgress.style.width = `${progress}%`;

  jobNavButtons.forEach(button => {
    const direction = Number(button.dataset.jobDir || 0);
    button.disabled = direction < 0 ? activeIndex === 0 : activeIndex === jobCards.length - 1;
  });
};

const requestJobSliderUpdate = () => {
  if (jobSliderTicking) return;
  jobSliderTicking = true;
  requestAnimationFrame(updateJobSlider);
};

const scrollToJobCard = index => {
  if (!jobRail || !jobCards[index]) return;
  jobCards[index].scrollIntoView({
    behavior: jobMotionQuery.matches ? "auto" : "smooth",
    block: "nearest",
    inline: "start"
  });
};

if (jobRail && jobCards.length) {
  updateJobSlider();
  jobRail.addEventListener("scroll", requestJobSliderUpdate, { passive: true });
  window.addEventListener("resize", requestJobSliderUpdate);

  jobNavButtons.forEach(button => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.jobDir || 0);
      const targetIndex = Math.max(0, Math.min(jobCards.length - 1, getActiveJobIndex() + direction));
      scrollToJobCard(targetIndex);
    });
  });
}

const awardRail = document.querySelector("#awardRail");
const awardCards = Array.from(document.querySelectorAll("[data-award-card]"));
const awardProgress = document.querySelector("#awardProgress");
const awardNavButtons = document.querySelectorAll("[data-award-dir]");
const awardMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let awardActiveIndex = 0;
let awardSliderTicking = false;

const getActiveAwardIndex = () => {
  if (!awardRail || !awardCards.length) return 0;
  const railCenter = awardRail.scrollLeft + awardRail.clientWidth / 2;
  return awardCards.reduce((bestIndex, card, index) => {
    const bestCard = awardCards[bestIndex];
    const currentDistance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - railCenter);
    const bestDistance = Math.abs(bestCard.offsetLeft + bestCard.offsetWidth / 2 - railCenter);
    return currentDistance < bestDistance ? index : bestIndex;
  }, 0);
};

const setActiveAward = (index, shouldScroll = false) => {
  if (!awardRail || !awardCards.length) return;
  awardActiveIndex = Math.max(0, Math.min(awardCards.length - 1, index));

  awardCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === awardActiveIndex);
  });

  if (awardProgress) {
    awardProgress.style.width = `${((awardActiveIndex + 1) / awardCards.length) * 100}%`;
  }

  awardNavButtons.forEach(button => {
    const direction = Number(button.dataset.awardDir || 0);
    button.disabled = direction < 0 ? awardActiveIndex === 0 : awardActiveIndex === awardCards.length - 1;
  });

  if (shouldScroll && awardRail.scrollWidth > awardRail.clientWidth + 4) {
    awardCards[awardActiveIndex].scrollIntoView({
      behavior: awardMotionQuery.matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
  }
};

const requestAwardSliderUpdate = () => {
  if (awardSliderTicking) return;
  awardSliderTicking = true;
  requestAnimationFrame(() => {
    awardSliderTicking = false;
    if (awardRail && awardRail.scrollWidth > awardRail.clientWidth + 4) {
      setActiveAward(getActiveAwardIndex());
    }
  });
};

if (awardRail && awardCards.length) {
  setActiveAward(0);
  awardRail.addEventListener("scroll", requestAwardSliderUpdate, { passive: true });
  window.addEventListener("resize", () => setActiveAward(awardActiveIndex));

  awardNavButtons.forEach(button => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.awardDir || 0);
      setActiveAward(awardActiveIndex + direction, true);
    });
  });

  awardCards.forEach((card, index) => {
    card.addEventListener("click", () => setActiveAward(index, true));
  });

  awardRail.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setActiveAward(awardActiveIndex + 1, true);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setActiveAward(awardActiveIndex - 1, true);
    }
  });
}

document.querySelectorAll("[data-job]").forEach(button => {
  button.addEventListener("click", () => {
    const selectedJob = button.dataset.job;
    if (desiredJob && selectedJob) {
      desiredJob.value = selectedJob;
      desiredJob.dispatchEvent(new Event("change", { bubbles: true }));
      desiredJobField?.classList.add("is-highlighted");
      window.setTimeout(() => desiredJobField?.classList.remove("is-highlighted"), 1800);
    }

    applySection?.scrollIntoView({
      behavior: jobMotionQuery.matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

applyForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!privacyConsent?.checked) {
    showPrivacyError();
    return;
  }

  if (!applyForm.checkValidity()) {
    applyForm.reportValidity();
    return;
  }

  const formData = new FormData(applyForm);
  const selectedPosition = formData.get("Gewünschte Stelle") || "Elektroniker / Elektroinstallateur (m/w/d)";
  const lines = [
    "Hallo FAE-Team,",
    "",
    `ich interessiere mich fuer die Stelle ${selectedPosition}.`,
    "",
    ...Array.from(formData.entries()).map(([key, value]) => `${key}: ${value || "-"}`),
    "",
    "Ich freue mich auf die garantierte Rueckmeldung innerhalb von 24 Stunden.",
    "",
    "Viele Gruesse"
  ];

  const subject = encodeURIComponent(`Bewerbung ${selectedPosition}`);
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:perspektiven@fae.energy?subject=${subject}&body=${body}`;
});

const counters = document.querySelectorAll("[data-counter-target]");
const runCounter = counter => {
  const target = Number(counter.dataset.counterTarget || 0);
  if (!target || counter.dataset.counted === "true") return;
  counter.dataset.counted = "true";
  const duration = 950;
  const start = performance.now();

  const tick = now => {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = `${Math.round(target * eased)}+`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );
  counters.forEach(counter => counterObserver.observe(counter));
} else {
  counters.forEach(runCounter);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
let ticking = false;

const updateParallax = () => {
  ticking = false;
  if (reduceMotion || window.innerWidth < 760) return;
  const viewportMiddle = window.innerHeight / 2;

  parallaxItems.forEach(item => {
    const speed = Number(item.dataset.parallax || 0);
    const rect = item.getBoundingClientRect();
    const distance = rect.top + rect.height / 2 - viewportMiddle;
    const offset = Math.max(-18, Math.min(18, distance * speed * -1));
    item.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  });
};

const requestParallax = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateParallax);
};

if (parallaxItems.length) {
  updateParallax();
  window.addEventListener("scroll", requestParallax, { passive: true });
  window.addEventListener("resize", requestParallax);
}

const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (hoverFine && !reduceMotion) {
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll("[data-magnetic]").forEach(button => {
    button.addEventListener("pointermove", event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}
