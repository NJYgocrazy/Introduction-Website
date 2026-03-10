<template>
  <div class="relative overflow-hidden rounded-xl2" style="box-shadow: var(--shadow-soft)">
    <div
      class="absolute inset-0 transition-opacity duration-700"
      v-for="(img, idx) in images"
      :key="img.id"
      :style="{
        opacity: idx === active ? 1 : 0,
        backgroundImage: `url(${img.imageUrl})`
      }"
    >
      <div class="absolute inset-0 bg-center bg-cover" :style="{ backgroundImage: `url(${img.imageUrl})` }" />
      <div class="absolute inset-0" style="background: linear-gradient(120deg, rgba(0,0,0,0.55), rgba(0,0,0,0.05))" />
    </div>

    <div class="relative p-6 sm:p-10 min-h-[260px] sm:min-h-[360px] flex flex-col justify-end">
      <div class="max-w-2xl">
        <div class="text-xs tracking-widest uppercase opacity-80">Graduate Lab</div>
        <h1 class="text-3xl sm:text-5xl font-semibold leading-tight mt-3">
          {{ titleText }}
        </h1>
        <p class="text-sm sm:text-base opacity-90 mt-3">
          {{ captionText }}
        </p>
      </div>

      <div class="mt-5 flex items-center gap-2">
        <button
          v-for="(img, idx) in images"
          :key="img.id + '-' + idx"
          class="h-2.5 rounded-full transition-all"
          :style="{
            width: idx === active ? '24px' : '10px',
            background: idx === active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'
          }"
          @click="active = idx"
          aria-label="Slide"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { getLocale } from "../i18n";

export type CarouselImage = {
  id: number;
  imageUrl: string;
  titleZh?: string | null;
  titleEn?: string | null;
  captionZh?: string | null;
  captionEn?: string | null;
};

const props = defineProps<{ images: CarouselImage[] }>();

const active = ref(0);

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

let timer: number | undefined;

onMounted(() => {
  if (props.images.length <= 1) return;
  timer = window.setInterval(() => {
    active.value = (active.value + 1) % props.images.length;
  }, 5200);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<style scoped>
.relative > .absolute {
  will-change: opacity;
}
</style>
