<template>
  <div
    class="carousel relative overflow-hidden"
    :class="[variantClass, props.rounded ? 'rounded-xl2' : '']"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointercancel="resetPointer"
    @pointerleave="resetPointer"
  >
    <div
      v-for="(img, idx) in images"
      :key="img.id"
      class="absolute inset-0 transition-opacity duration-700"
      :style="{ opacity: idx === active ? 1 : 0 }"
      aria-hidden="true"
    >
      <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${img.imageUrl})` }" />

      <div
        v-if="variant === 'hero'"
        class="absolute inset-0"
        style="background: linear-gradient(120deg, rgba(0,0,0,0.50), rgba(0,0,0,0.05))"
      />
      <div
        v-else
        class="absolute inset-0"
        style="background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.20))"
      />
    </div>

    <button
      v-if="showArrows && images.length > 1"
      type="button"
      class="carousel-arrow absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full flex items-center justify-center"
      aria-label="Previous slide"
      @pointerdown.stop
      @click="prev"
    >
      <span aria-hidden="true">&#8249;</span>
    </button>
    <button
      v-if="showArrows && images.length > 1"
      type="button"
      class="carousel-arrow absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full flex items-center justify-center"
      aria-label="Next slide"
      @pointerdown.stop
      @click="next"
    >
      <span aria-hidden="true">&#8250;</span>
    </button>

    <div class="relative flex flex-col justify-end" :class="heightClass">
      <div
        v-if="variant === 'hero'"
        class="relative p-6 sm:p-10"
        style="color: rgba(255,255,255,0.98)"
      >
        <div class="max-w-2xl">
          <div class="text-xs tracking-widest uppercase opacity-85">{{ kickerText }}</div>
          <h1 class="text-3xl sm:text-5xl font-semibold leading-tight mt-3">
            {{ titleText }}
          </h1>
          <p class="text-sm sm:text-base opacity-90 mt-3">
            {{ captionText }}
          </p>
        </div>

        <div v-if="showDots && images.length > 1" class="mt-5 flex items-center gap-2">
          <button
            v-for="(img, idx) in images"
            :key="img.id + '-' + idx"
            type="button"
            class="carousel-dot h-2.5 rounded-full transition-all"
            :data-active="idx === active"
            :style="{ width: idx === active ? '24px' : '10px' }"
            @pointerdown.stop
            @click="go(idx)"
            aria-label="Slide"
          />
        </div>
      </div>

      <div
        v-else-if="titleText || captionText || (showDots && images.length > 1)"
        class="absolute inset-x-0 bottom-0 border-t"
        style="border-color: rgb(var(--c-border)); background: rgba(255,255,255,0.92)"
      >
        <div class="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-semibold truncate">
              {{ titleText }}
            </div>
            <div v-if="captionText" class="text-xs opacity-80 mt-1 line-clamp-2">
              {{ captionText }}
            </div>
          </div>

          <div v-if="showDots && images.length > 1" class="flex items-center gap-2">
            <button
              v-for="(img, idx) in images"
              :key="img.id + '-' + idx"
              type="button"
              class="carousel-dot h-2.5 rounded-full transition-all"
              :data-active="idx === active"
              :style="{ width: idx === active ? '24px' : '10px' }"
              @pointerdown.stop
              @click="go(idx)"
              aria-label="Slide"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { getLocale } from "../i18n";

export type CarouselImage = {
  id: number;
  imageUrl: string;
  titleZh?: string | null;
  titleEn?: string | null;
  captionZh?: string | null;
  captionEn?: string | null;
};

const props = withDefaults(
  defineProps<{
    images: CarouselImage[];
    variant?: "hero" | "center";
    rounded?: boolean;
    autoplay?: boolean;
    intervalMs?: number;
    pauseOnHover?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    heightClass?: string;
  }>(),
  {
    variant: "hero",
    rounded: true,
    autoplay: true,
    intervalMs: 5200,
    pauseOnHover: true,
    showArrows: true,
    showDots: true
  }
);

const active = ref(0);
const paused = ref(false);

const titleText = computed(() => {
  const img = props.images[active.value];
  if (!img) return "";
  const locale = getLocale();
  return (
    (locale === "zh" ? img.titleZh : img.titleEn) ??
    img.titleZh ??
    img.titleEn ??
    ""
  );
});

const kickerText = computed(() => (getLocale() === "zh" ? "研究实验室" : "Research Lab"));

const captionText = computed(() => {
  const img = props.images[active.value];
  if (!img) return "";
  const locale = getLocale();
  return (
    (locale === "zh" ? img.captionZh : img.captionEn) ??
    img.captionZh ??
    img.captionEn ??
    ""
  );
});

const heightClass = computed(() => {
  if (props.heightClass) return props.heightClass;
  return props.variant === "hero" ? "min-h-[260px] sm:min-h-[360px]" : "min-h-[220px] sm:min-h-[300px]";
});

const variantClass = computed(() => {
  return props.variant === "hero" ? "carousel-hero" : "carousel-center";
});

function go(idx: number) {
  if (props.images.length === 0) return;
  const nextIdx = ((idx % props.images.length) + props.images.length) % props.images.length;
  active.value = nextIdx;
}

function next() {
  if (props.images.length <= 1) return;
  go(active.value + 1);
}

function prev() {
  if (props.images.length <= 1) return;
  go(active.value - 1);
}

let timer: number | undefined;

function stopTimer() {
  if (timer) window.clearInterval(timer);
  timer = undefined;
}

function startTimer() {
  stopTimer();
  if (!props.autoplay) return;
  if (paused.value) return;
  if (props.images.length <= 1) return;
  const interval = Math.max(1200, Number(props.intervalMs) || 5200);
  timer = window.setInterval(() => next(), interval);
}

watch(
  [() => props.images.length, () => props.autoplay, () => props.intervalMs, paused],
  () => {
    if (active.value >= props.images.length) active.value = 0;
    startTimer();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  stopTimer();
});

function handleMouseEnter() {
  if (!props.pauseOnHover) return;
  paused.value = true;
  stopTimer();
}

function handleMouseLeave() {
  if (!props.pauseOnHover) return;
  paused.value = false;
  startTimer();
}

let pointerId: number | null = null;
let startX = 0;
let startY = 0;

function isInteractiveTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el) return false;
  return Boolean(el.closest("button,a,[role='button'],input,textarea,select,label"));
}

function handlePointerDown(e: PointerEvent) {
  if (props.images.length <= 1) return;
  if (isInteractiveTarget(e.target)) return;
  pointerId = e.pointerId;
  startX = e.clientX;
  startY = e.clientY;
  (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
}

function handlePointerUp(e: PointerEvent) {
  if (pointerId == null || e.pointerId !== pointerId) return;
  if (isInteractiveTarget(e.target)) {
    resetPointer(e);
    return;
  }
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  resetPointer(e);
  if (absX < 40) return;
  if (absX <= absY) return;
  if (dx < 0) next();
  else prev();
}

function resetPointer(e?: PointerEvent) {
  if (e && pointerId != null) {
    try {
      (e.currentTarget as HTMLElement | null)?.releasePointerCapture?.(pointerId);
    } catch {
      // ignore
    }
  }
  pointerId = null;
  startX = 0;
  startY = 0;
}
</script>

<style scoped>
.relative > .absolute {
  will-change: opacity;
}

.carousel {
  touch-action: pan-y;
  width: 100%;
    height: 100%;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
