<script setup lang="ts">
useReveal();
</script>

<template>
  <div class="site-layout">
    <SiteSvgSprite />
    <SiteAppHeader />
    <main>
      <slot />
    </main>
    <SiteAppFooter />
  </div>
</template>

<style>
.site-layout *,
.site-layout *::before,
.site-layout *::after {
  box-sizing: border-box;
}
:root {
  --navy: #1b2a6b;
  --navy-deep: #0e1840;
  --red: #e3001b;
  --red-hover: #ff1a35;
  --gold: #c5a55a;
  --gold-light: #d4ba7a;
  --white: #fafafa;
  --off-white: #f2f2f4;
  --gray-100: #e8e8ec;
  --gray-200: #d1d1d8;
  --gray-400: #8e8e9a;
  --gray-600: #52525b;
  --gray-800: #1e1e24;
  --font: "Space Grotesk", system-ui, sans-serif;
  --display: "Host Grotesk", system-ui, sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
.site-layout {
  font-family: var(--font);
  color: var(--gray-800);
  background: var(--white);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
.site-layout a {
  color: inherit;
}
.svg-sprite {
  display: none;
}
.site-layout [data-reveal] {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}
.site-layout [data-reveal].visible {
  opacity: 1;
  transform: translateY(0);
}
.site-layout [data-reveal="delay-1"] {
  transition-delay: 0.1s;
}
.site-layout [data-reveal="delay-2"] {
  transition-delay: 0.2s;
}
.site-layout [data-reveal="delay-3"] {
  transition-delay: 0.3s;
}
.site-layout [data-reveal="delay-4"] {
  transition-delay: 0.4s;
}
.site-layout [data-reveal="delay-5"] {
  transition-delay: 0.5s;
}
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.4s var(--ease);
}
.nav.solid {
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  min-width: 0;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
}
.nav.solid .nav-logo {
  background: transparent;
  padding-left: 0;
}
.brand-logo {
  display: block;
  width: auto;
  height: 42px;
  object-fit: contain;
}
.footer-logo {
  width: fit-content;
  background: white;
}
.footer-brand-logo {
  height: 38px;
}
.nav-links {
  display: flex;
  gap: 2px;
  align-items: center;
}
.nav-links a {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.25s;
  position: relative;
}
.nav:not(.solid) .nav-links a {
  color: rgba(255, 255, 255, 0.75);
}
.nav:not(.solid) .nav-links a:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}
.nav.solid .nav-links a {
  color: var(--gray-600);
}
.nav.solid .nav-links a:hover {
  color: var(--navy);
  background: var(--off-white);
}
.nav-links a.active {
  font-weight: 600;
}
.nav:not(.solid) .nav-links a.active {
  color: white;
}
.nav.solid .nav-links a.active {
  color: var(--navy);
}
.nav-cta-btn {
  background: var(--red) !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 10px 22px !important;
  border-radius: 8px !important;
  transition: all 0.25s !important;
}
.nav-cta-btn:hover {
  background: var(--red-hover) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(227, 0, 27, 0.25);
}
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  margin: 5px 0;
  border-radius: 2px;
  transition: 0.3s;
}
.nav:not(.solid) .hamburger span {
  background: white;
}
.nav.solid .hamburger span {
  background: var(--navy);
}
.mobile-menu {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--navy-deep);
  z-index: 99;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.mobile-menu.open {
  display: flex;
}
.mobile-menu a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 12px;
  transition: 0.2s;
  font-family: var(--display);
}
.mobile-menu a:hover {
  color: white;
  background: rgba(255, 255, 255, 0.06);
}
.mobile-close {
  position: absolute;
  top: 24px;
  right: 32px;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}
.mobile-close:hover {
  background: rgba(255, 255, 255, 0.08);
}
.page {
  display: block;
  animation: pageIn 0.5s var(--ease);
}
@keyframes pageIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
section {
  padding: 100px 32px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 32px 80px;
  background: var(--navy-deep);
  color: white;
  position: relative;
  overflow: hidden;
}
.hero-bg,
.hero-overlay {
  position: absolute;
  inset: 0;
}
.hero-scene {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 7vw;
  background: linear-gradient(
      135deg,
      rgba(14, 24, 64, 0.88),
      rgba(27, 42, 107, 0.35)
    ),
    repeating-linear-gradient(
      110deg,
      rgba(255, 255, 255, 0.06) 0 2px,
      transparent 2px 34px
    ),
    radial-gradient(circle at 68% 45%, rgba(227, 0, 27, 0.25), transparent 32%);
  opacity: 0.65;
}
.hero-scene span {
  font-family: var(--display);
  font-size: clamp(80px, 18vw, 240px);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.08);
  line-height: 0.8;
}
.hero-scene strong {
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 4px;
  font-size: 12px;
  margin-top: 22px;
}
.hero-overlay {
  background: linear-gradient(
    135deg,
    var(--navy-deep) 30%,
    rgba(14, 24, 64, 0.72) 100%
  );
}
.hero .container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.hero-content {
  max-width: 760px;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(197, 165, 90, 0.35);
  background: rgba(197, 165, 90, 0.08);
  color: var(--gold-light);
  font-size: 13px;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 28px;
  letter-spacing: 0.5px;
}
.hero h1 {
  font-family: var(--display);
  font-size: clamp(40px, 5.5vw, 68px);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 24px;
  letter-spacing: 0;
}
.hero h1 .accent {
  color: var(--red);
}
.hero p {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}
.hero-actions,
.cta-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}
.hero-stats {
  display: flex;
  gap: 48px;
  margin-top: 64px;
  padding-top: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.hero-stat {
  text-align: center;
}
.hero-stat .val {
  font-family: var(--display);
  font-size: 32px;
  font-weight: 800;
  color: white;
}
.hero-stat .lbl {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 4px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s var(--ease);
  border: none;
  cursor: pointer;
  font-family: var(--font);
  letter-spacing: 0.2px;
  width: fit-content;
}
.btn svg {
  flex-shrink: 0;
}
.btn-red {
  background: var(--red);
  color: white;
}
.btn-red:hover {
  background: var(--red-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(227, 0, 27, 0.3);
}
.btn-ghost {
  background: transparent;
  color: white;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
}
.btn-ghost:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.04);
}
.btn-navy {
  background: var(--navy);
  color: white;
}
.btn-navy:hover {
  background: var(--navy-deep);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(27, 42, 107, 0.25);
}
.btn-outline-dark {
  background: transparent;
  color: var(--navy);
  border: 1.5px solid var(--gray-200);
}
.btn-outline-dark:hover {
  border-color: var(--navy);
  background: var(--navy);
  color: white;
}
.marquee-wrap {
  background: var(--red);
  padding: 14px 0;
  overflow: hidden;
  position: relative;
}
.marquee {
  display: flex;
  gap: 48px;
  animation: marquee 30s linear infinite;
  white-space: nowrap;
  width: max-content;
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
.marquee span {
  font-size: 14px;
  font-weight: 600;
  color: white;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 12px;
}
.marquee span::before {
  content: "";
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  flex-shrink: 0;
}
.sec-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--red);
  margin-bottom: 12px;
}
.sec-title {
  font-family: var(--display);
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  color: var(--navy-deep);
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: 0;
}
.sec-desc {
  font-size: 16px;
  color: var(--gray-400);
  max-width: 520px;
  line-height: 1.7;
}
.services-section {
  background: var(--off-white);
}
.services-grid,
.sos-grid,
.rent-grid,
.auto-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 48px;
}
.svc-card {
  background: white;
  border-radius: 16px;
  padding: 32px 28px;
  transition: all 0.4s var(--ease);
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}
.svc-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--navy);
  transform: scaleX(0);
  transition: transform 0.4s var(--ease);
  transform-origin: left;
}
.svc-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(14, 24, 64, 0.1);
  border-color: var(--gray-100);
}
.svc-card:hover::before {
  transform: scaleX(1);
}
.static-card {
  cursor: default;
}
.svc-card-icon,
.sos-card-ic,
.contact-item-ic,
.park-feat-ic {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.svc-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.svc-card-icon svg {
  width: 24px;
  height: 24px;
}
.svc-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy-deep);
  margin-bottom: 8px;
}
.svc-card p {
  font-size: 14px;
  color: var(--gray-400);
  line-height: 1.6;
  flex: 1;
}
.svc-card-arrow {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s var(--ease);
}
.svc-card:hover .svc-card-arrow {
  opacity: 1;
  transform: translateX(0);
}
.ic-red {
  background: rgba(227, 0, 27, 0.2);
  color: var(--red);
}
.ic-blue {
  background: rgba(27, 42, 107, 0.12);
  color: var(--navy);
}
.ic-gold {
  background: rgba(197, 165, 90, 0.2);
  color: var(--gold);
}
.ic-gray {
  background: rgba(82, 82, 91, 0.08);
  color: var(--gray-600);
}
.about-section {
  position: relative;
}
.about-grid,
.parking-grid,
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  margin-top: 48px;
}
.about-visual {
  position: relative;
}
.about-img-main {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 20px;
  background: var(--off-white);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.brand-panel {
  background: linear-gradient(135deg, var(--off-white), white);
  border: 1px solid var(--gray-100);
}
.brand-panel img {
  width: min(74%, 420px);
  height: auto;
  object-fit: contain;
}
.brand-panel span {
  font-family: var(--display);
  color: var(--navy-deep);
  font-size: clamp(34px, 5vw, 72px);
  font-weight: 800;
  line-height: 0.9;
  text-align: center;
}
.about-float {
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: var(--red);
  color: white;
  padding: 20px 28px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(227, 0, 27, 0.2);
}
.about-float .num {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}
.about-float .lbl {
  font-size: 12px;
  font-weight: 500;
  opacity: 0.8;
  margin-top: 2px;
}
.about-text p {
  color: var(--gray-600);
  line-height: 1.8;
  margin-bottom: 16px;
  font-size: 15px;
}
.about-badges {
  display: flex;
  gap: 16px;
  margin-top: 28px;
  flex-wrap: wrap;
}
.about-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--off-white);
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--navy);
}
.about-badge svg {
  width: 18px;
  height: 18px;
  color: var(--red);
}
.parking-section {
  background: var(--navy-deep);
  color: white;
  position: relative;
  overflow: hidden;
}
.parking-section::before {
  content: "";
  position: absolute;
  top: -200px;
  right: -200px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: var(--red);
  opacity: 0.06;
}
.parking-section h2 {
  font-family: var(--display);
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
}
.parking-section p {
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
}
.parking-logo-text {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border: 1px solid rgba(197, 165, 90, 0.35);
  border-radius: 10px;
  color: var(--gold-light);
  font-family: var(--display);
  font-weight: 800;
  margin-bottom: 24px;
}
.parking-logo-text.dark {
  color: var(--navy-deep);
  border-color: var(--gray-200);
  background: white;
  margin: 0;
}
.park-feats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 32px;
}
.park-feat {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.park-feat-ic {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
}
.park-feat-ic svg {
  width: 20px;
  height: 20px;
  color: var(--gold-light);
}
.park-feat h5 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 3px;
}
.park-feat p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}
.parking-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.parking-card-visual {
  width: min(320px, 100%);
  aspect-ratio: 1;
  border-radius: 28px;
  background: linear-gradient(145deg, white, var(--off-white));
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--navy-deep);
  text-align: center;
  padding: 32px;
}
.parking-card-visual span {
  width: 98px;
  height: 98px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--navy);
  color: white;
  font-family: var(--display);
  font-size: 58px;
  font-weight: 800;
  margin-bottom: 20px;
}
.parking-card-visual strong {
  font-size: 20px;
  color: var(--navy-deep);
}
.parking-card-visual small {
  margin-top: 8px;
  color: var(--gray-400);
}
.parking-highlight {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--off-white);
  border-radius: 20px;
  padding: 48px;
}
.cta-band {
  background: var(--red);
  padding: 48px 32px;
  text-align: center;
  color: white;
}
.cta-band h3 {
  font-family: var(--display);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800;
  margin-bottom: 8px;
}
.cta-band p {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 24px;
}
.cta-band .btn-ghost {
  border-color: rgba(255, 255, 255, 0.35);
}
.cta-band .btn-ghost:hover {
  background: white;
  color: var(--red);
  border-color: white;
}
.sub-hero {
  padding: 140px 32px 64px;
  background: var(--navy-deep);
  color: white;
  position: relative;
  overflow: hidden;
}
.sub-hero::before {
  content: "";
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: var(--red);
  opacity: 0.05;
}
.sub-hero .sec-label {
  color: var(--gold-light);
}
.sub-hero h1 {
  font-family: var(--display);
  font-size: clamp(32px, 4.5vw, 56px);
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: 0;
}
.sub-hero p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 17px;
  max-width: 560px;
  line-height: 1.7;
}
.sos-banner {
  background: var(--red);
  color: white;
  border-radius: 20px;
  padding: 56px;
  text-align: center;
  margin-bottom: 64px;
  position: relative;
  overflow: hidden;
}
.sos-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 0v60M0 30h60' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3C/svg%3E");
}
.sos-banner > * {
  position: relative;
  z-index: 1;
}
.sos-banner h3 {
  font-family: var(--display);
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
}
.sos-banner p {
  font-size: 17px;
  opacity: 0.85;
  margin-bottom: 28px;
}
.sos-phone {
  font-family: var(--display);
  font-size: clamp(36px, 5vw, 56px);
  color: white;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: 2px;
  display: inline-block;
  transition: 0.3s;
}
.sos-phone:hover {
  transform: scale(1.04);
}
.sos-secondary {
  color: white;
  font-size: 17px;
  opacity: 0.7;
  margin-top: 12px;
  display: inline-block;
  text-decoration: none;
}
.sos-card {
  background: white;
  border: 1px solid var(--gray-100);
  border-radius: 14px;
  padding: 28px 24px;
  transition: all 0.3s var(--ease);
}
.sos-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.sos-card-ic {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(227, 0, 27, 0.06);
  margin-bottom: 14px;
}
.sos-card-ic svg {
  width: 20px;
  height: 20px;
  color: var(--red);
}
.sos-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy-deep);
  margin-bottom: 6px;
}
.sos-card p {
  font-size: 13px;
  color: var(--gray-400);
  line-height: 1.6;
}
.rent-card,
.auto-card {
  border: 1px solid var(--gray-100);
  border-radius: 16px;
  overflow: hidden;
  background: white;
  transition: all 0.4s var(--ease);
}
.rent-card:hover,
.auto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
}
.rent-card-img {
  height: 180px;
}
.auto-card-img {
  height: 200px;
  position: relative;
}
.img-placeholder {
  background: var(--off-white);
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 10px,
    rgba(27, 42, 107, 0.03) 10px,
    rgba(27, 42, 107, 0.03) 20px
  );
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.img-placeholder span {
  font-family: monospace;
  font-size: 11px;
  color: var(--gray-400);
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 10px;
  border-radius: 4px;
}
.rent-card-body,
.auto-card-body {
  padding: 24px;
}
.rent-card-body h4,
.auto-card-body h4 {
  font-size: 18px;
  font-weight: 700;
  color: var(--navy-deep);
  margin-bottom: 4px;
}
.rent-card-body .cat {
  font-size: 12px;
  color: var(--red);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.rent-card-body p,
.auto-card-body p {
  font-size: 14px;
  color: var(--gray-400);
  line-height: 1.6;
}
.auto-brand-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  background: var(--navy-deep);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 6px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.rent-form-section {
  margin-top: 64px;
  background: var(--off-white);
  border-radius: 20px;
  padding: 48px;
}
.rent-form-section h3 {
  font-family: var(--display);
  font-size: 28px;
  color: var(--navy-deep);
  margin-bottom: 8px;
}
.rent-form-section > p {
  color: var(--gray-400);
  margin-bottom: 24px;
}
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.contact-item {
  display: flex;
  gap: 16px;
}
.contact-item-ic {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--off-white);
}
.contact-item-ic svg {
  width: 20px;
  height: 20px;
  color: var(--navy);
}
.contact-item h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--navy-deep);
  margin-bottom: 3px;
}
.contact-item p,
.contact-item a {
  font-size: 14px;
  color: var(--gray-600);
  text-decoration: none;
  line-height: 1.6;
}
.contact-item a:hover {
  color: var(--red);
}
.hours-block {
  margin-top: 12px;
  padding: 24px;
  background: var(--off-white);
  border-radius: 14px;
}
.hours-block h5 {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.hours-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 6px 0;
  font-size: 14px;
}
.hours-row .day {
  font-weight: 600;
  color: var(--gray-800);
}
.hours-row .time {
  color: var(--gray-400);
  text-align: right;
}
.sos-always {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(227, 0, 27, 0.06);
  color: var(--red);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
}
.sos-always::before {
  content: "";
  width: 8px;
  height: 8px;
  background: var(--red);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.contact-form input,
.contact-form textarea,
.contact-form select {
  font-family: var(--font);
  font-size: 15px;
  padding: 15px 18px;
  border: 1.5px solid var(--gray-100);
  border-radius: 12px;
  outline: none;
  transition: all 0.25s;
  background: white;
  color: var(--gray-800);
  width: 100%;
}
.contact-form input:focus,
.contact-form textarea:focus,
.contact-form select:focus {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(27, 42, 107, 0.08);
}
.contact-form textarea {
  resize: vertical;
  min-height: 120px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.form-intro {
  color: var(--gray-400);
  margin: 8px 0 24px;
  font-size: 15px;
}
.center-cta {
  margin-top: 64px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.center-cta p {
  font-size: 16px;
  color: var(--gray-400);
  margin-bottom: 20px;
}
footer {
  background: var(--gray-800);
  color: white;
  padding: 72px 32px 28px;
}
.footer-top {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 48px;
}
.footer-brand p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
  margin-top: 16px;
}
footer h6 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gold-light);
  margin-bottom: 18px;
}
footer ul {
  list-style: none;
}
footer ul li {
  margin-bottom: 10px;
}
footer ul a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: 0.2s;
}
footer ul a:hover {
  color: white;
}
.footer-bottom {
  max-width: 1200px;
  margin: 56px auto 0;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
}
.mt-24 {
  margin-top: 24px;
}
.mt-28 {
  margin-top: 28px;
}
.mt-32 {
  margin-top: 32px;
}
.mt-72 {
  margin-top: 72px;
}
.mt-80 {
  margin-top: 80px;
}
.max-640 {
  max-width: 640px;
}
.small-title {
  font-size: 28px;
}
@media (max-width: 1040px) {
  .nav-links a {
    padding: 8px 10px;
  }
  .brand-logo {
    height: 38px;
  }
}
@media (max-width: 960px) {
  .nav-links {
    display: none;
  }
  .hamburger {
    display: block;
  }
  .hero-stats {
    gap: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .services-grid,
  .sos-grid,
  .rent-grid,
  .auto-grid {
    grid-template-columns: 1fr 1fr;
  }
  .about-grid,
  .parking-grid,
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 56px;
  }
  .footer-top {
    grid-template-columns: 1fr 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  section {
    padding: 72px 20px;
  }
  .parking-highlight {
    min-height: 220px;
  }
}
@media (max-width: 640px) {
  .nav-inner {
    padding: 0 20px;
  }
  .services-grid,
  .sos-grid,
  .rent-grid,
  .auto-grid {
    grid-template-columns: 1fr;
  }
  .footer-top {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  .hero {
    padding: 108px 20px 64px;
  }
  .hero-stats {
    margin-top: 48px;
    padding-top: 36px;
  }
  .hero-actions,
  .cta-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .btn {
    justify-content: center;
    width: 100%;
  }
  .sos-banner,
  .rent-form-section {
    padding: 32px 22px;
  }
  .hours-row {
    flex-direction: column;
    gap: 2px;
  }
  .hours-row .time {
    text-align: left;
  }
  .about-float {
    right: 12px;
  }
}

/* ── Booking widget ─────────────────────────────────── */
.booking-widget {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--gray-100);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
  max-width: 740px;
  margin-top: 40px;
}
.booking-loc {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  border-bottom: 1px solid var(--gray-100);
}
.booking-loc svg {
  color: var(--red);
  flex-shrink: 0;
}
.booking-loc select {
  flex: 1;
  border: none;
  outline: none;
  font-family: var(--font);
  font-size: 15px;
  color: var(--gray-700);
  background: transparent;
}
.booking-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--gray-100);
}
.booking-date-col {
  padding: 16px 24px;
}
.booking-date-col + .booking-date-col {
  border-left: 1px solid var(--gray-100);
}
.booking-date-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-400);
  margin-bottom: 10px;
}
.booking-date-col input {
  display: block;
  width: 100%;
  border: 1.5px solid var(--gray-100);
  border-radius: 8px;
  padding: 9px 12px;
  font-family: var(--font);
  font-size: 14px;
  color: var(--gray-800);
  outline: none;
  margin-bottom: 8px;
  background: var(--off-white);
  transition: border-color 0.2s;
}
.booking-date-col input:last-child {
  margin-bottom: 0;
}
.booking-date-col input:focus {
  border-color: var(--navy);
  background: white;
}
.booking-vtypes {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--gray-100);
}
.booking-vt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 14px 0;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;
  border-right: 1px solid var(--gray-100);
}
.booking-vt:last-child {
  border-right: none;
}
.booking-vt.active {
  background: rgba(27, 42, 107, 0.05);
}
.booking-vt-icon {
  font-size: 22px;
  line-height: 1;
}
.booking-vt-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-400);
}
.booking-vt.active .booking-vt-label {
  color: var(--navy);
}
.booking-footer {
  padding: 16px 24px;
}

/* ── Nav auth ───────────────────────────────────────── */
.nav-auth {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-auth-link {
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 8px;
  transition: all 0.25s;
}
.nav:not(.solid) .nav-auth-link {
  color: rgba(255, 255, 255, 0.8);
}
.nav:not(.solid) .nav-auth-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}
.nav.solid .nav-auth-link {
  color: var(--gray-600);
}
.nav.solid .nav-auth-link:hover {
  color: var(--navy);
  background: var(--off-white);
}
.nav-auth-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font);
  transition: all 0.25s;
  border: 1.5px solid;
  background: transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}
.nav:not(.solid) .nav-auth-btn {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}
.nav:not(.solid) .nav-auth-btn:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.08);
}
.nav.solid .nav-auth-btn {
  border-color: var(--gray-200);
  color: var(--navy);
}
.nav.solid .nav-auth-btn:hover {
  border-color: var(--navy);
  background: rgba(27, 42, 107, 0.05);
}
.mobile-menu button.mobile-logout {
  background: none;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  font-size: 22px;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-family: var(--display);
  transition: 0.2s;
  margin-top: 8px;
}
.mobile-menu button.mobile-logout:hover {
  color: white;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.5);
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
@media (max-width: 960px) {
  .nav-auth {
    display: none;
  }
}
@media (max-width: 640px) {
  .booking-dates {
    grid-template-columns: 1fr;
  }
  .booking-date-col + .booking-date-col {
    border-left: none;
    border-top: 1px solid var(--gray-100);
  }
}
</style>
