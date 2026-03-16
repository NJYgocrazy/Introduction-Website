<template>
  <component
    :is="linkUrl ? 'a' : 'div'"
    class="card rounded-none overflow-hidden block w-full max-w-5xl mx-auto"
    :href="linkUrl || undefined"
    :target="linkUrl ? '_blank' : undefined"
    :rel="linkUrl ? 'noreferrer' : undefined"
  >
    <div class="flex flex-col md:flex-row">
      <div class="p-8 flex-1 min-w-0">
        <div class="text-lg font-semibold leading-snug">
          {{ titleText }}
        </div>
        <div v-if="descText" class="text-sm mt-2 leading-7" style="color: rgb(var(--c-muted))">
          {{ descText }}
        </div>
        <div v-if="linkUrl" class="text-sm mt-3" style="color: rgb(var(--c-accent))">
          {{ locale === "zh" ? "查看详情 ->" : "Learn more ->" }}
        </div>
      </div>

      <div class="md:w-64 md:border-l" style="border-color: rgb(var(--c-border))">
        <div class="h-48 md:h-full bg-center bg-cover" :style="{ backgroundImage: imageStyle }" role="img" :aria-label="titleText" />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type ResearchProject = {
  id: number | string;
  titleZh: string;
  titleEn: string;
  descZh?: string | null;
  descEn?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
};

const props = defineProps<{
  row: ResearchProject;
}>();

const locale = computed(() => getLocale());

const titleText = computed(() => pickText(props.row, "title"));
const descText = computed(() => pickText(props.row, "desc"));
const linkUrl = computed(() => (props.row.linkUrl ? String(props.row.linkUrl) : ""));

const imageStyle = computed(() => {
  const url = props.row.imageUrl ? String(props.row.imageUrl) : "";
  if (url) return `url(${url})`;
  return "linear-gradient(135deg, rgba(15,58,120,0.18), rgba(15,23,42,0.08))";
});
</script>