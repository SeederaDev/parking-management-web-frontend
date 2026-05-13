import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

export const useReveal = () => {
  const route = useRoute();
  let observer: IntersectionObserver | null = null;

  const initReveals = () => {
    if (typeof window === "undefined") return;
    observer?.disconnect();
    const elements = document.querySelectorAll(".page [data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    elements.forEach((element) => {
      element.classList.remove("visible");
      observer?.observe(element);
    });
  };

  onMounted(() => {
    initReveals();
    watch(
      () => route.fullPath,
      async () => {
        window.scrollTo({ top: 0, behavior: "auto" });
        await nextTick();
        initReveals();
      },
    );
  });

  onBeforeUnmount(() => observer?.disconnect());
};
