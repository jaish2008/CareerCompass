// ===========================
// Project Roadmap — interactivity
// Scroll-reveal for timeline items + animated stat counters
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  // --- Reveal timeline items as they enter the viewport ---
  const timelineItems = document.querySelectorAll(".timeline-item");

  timelineItems.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(18px)";
    item.style.transition = "opacity .5s ease, transform .5s ease";
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach(item => revealObserver.observe(item));

  // --- Animate the stat numbers on the milestone cards ---
  const statValues = document.querySelectorAll(".stats .stat-card h2");

  const animateNumber = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)\s*\/\s*(\d+)$/) || raw.match(/^(\d+)$/);
    if (!match) return; // skip non-numeric values

    const hasFraction = match.length === 3;
    const target = parseInt(match[1], 10);
    const suffix = hasFraction ? ` / ${match[2]}` : "";
    let current = 0;
    const duration = 700;
    const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 30);

    const timer = setInterval(() => {
      current++;
      el.textContent = `${current}${suffix}`;
      if (current >= target) clearInterval(timer);
    }, stepTime);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statValues.forEach(el => statObserver.observe(el));

});