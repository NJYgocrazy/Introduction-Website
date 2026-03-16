<template>
  <a class="card rounded-none p-6 hover:opacity-95 transition-opacity block w-full" :href="row.externalUrl"
    target="_blank" rel="noreferrer">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div class="min-w-0 flex-1">
        <div class="text-title text-lg font-semibold leading-snug">
          {{ titleText || fallbackTitle }}
        </div>
        <div class="text-sm mt-1" style="color: rgb(var(--c-muted))">{{ row.venue || "" }}</div>
        <div class="text-sm mt-2" style="color: rgb(var(--c-muted))" v-if="abstractText">
          {{ abstractText }}
        </div>
        <div class="mt-3 flex flex-wrap gap-2" v-if="tags.length">
          <span v-for="t in tags" :key="t" class="px-2 py-1 text-xs rounded-none"
            style="border: 1px solid rgb(var(--c-border)); background: rgb(248 250 252)">
            {{ t }}
          </span>
        </div>
      </div>

      <div class="text-xs mono whitespace-nowrap" style="color: rgb(var(--c-muted))">
        {{ dateText }}
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type Publication = {
  id: number;
  titleZh?: string | null;
  titleEn?: string | null;
  abstractZh?: string | null;
  abstractEn?: string | null;
  venue?: string | null;
  externalUrl: string;
  publishedAt?: string | null;
  tags?: any;
};

const props = defineProps<{
  row: Publication;
}>();

const locale = computed(() => getLocale());

const titleText = computed(() => pickText(props.row, "title"));
const abstractText = computed(() => pickText(props.row, "abstract"));

const fallbackTitle = computed(() => (locale.value === "zh" ? "（未命名条目）" : "(Untitled)"));

const tags = computed(() => {
  const raw = props.row.tags;
  if (Array.isArray(raw)) return raw.map((t) => String(t));
  return [] as string[];
});

const dateText = computed(() => {
  const value = props.row.publishedAt;
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
});
</script>

<style scoped>
.text-title {
  color: #743481;
}
</style>