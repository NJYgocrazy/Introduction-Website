<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <div class="text-xs tracking-widest uppercase opacity-70">Publications</div>
        <h1 class="text-3xl font-semibold mt-2">{{ locale === 'zh' ? '文章与出版物' : 'Publications' }}</h1>
        <p class="text-sm opacity-80 mt-2">
          {{ locale === 'zh' ? '点击跳转到原文链接。' : 'Click to open the external link.' }}
        </p>
      </div>

      <input
        v-model="q"
        class="input rounded-lg px-4 py-2 text-sm w-full sm:w-72"
        :placeholder="locale === 'zh' ? '搜索标题/会议...' : 'Search title/venue...'"
      />
    </div>

    <div class="mt-6 grid grid-cols-1 gap-4">
      <a
        v-for="p in filtered"
        :key="p.id"
        class="card rounded-xl2 p-5 hover:opacity-95 transition-opacity"
        :href="p.externalUrl"
        target="_blank"
        rel="noreferrer"
      >
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div class="text-lg font-semibold leading-snug">
              {{ pickText(p, 'title') || fallbackTitle(p) }}
            </div>
            <div class="text-sm opacity-80 mt-1">{{ p.venue || '' }}</div>
            <div class="text-sm opacity-75 mt-2" v-if="pickText(p, 'abstract')">
              {{ pickText(p, 'abstract') }}
            </div>
            <div class="mt-3 flex flex-wrap gap-2" v-if="tagList(p).length">
              <span
                v-for="t in tagList(p)"
                :key="t"
                class="px-2 py-1 text-xs rounded-full"
                style="border: 1px solid rgba(0,0,0,0.10); background: rgba(255,255,255,0.55)"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <div class="text-xs opacity-70 mono whitespace-nowrap">
            {{ formatDate(p.publishedAt) }}
          </div>
        </div>
      </a>

      <div v-if="!filtered.length" class="card rounded-xl2 p-6 text-sm opacity-80">
        {{ locale === 'zh' ? '暂无匹配条目。' : 'No matching items.' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { apiGet } from "../lib/api";
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

const locale = computed(() => getLocale());
const rows = ref<Publication[]>([]);
const q = ref("");

onMounted(async () => {
  rows.value = await apiGet<Publication[]>("/public/publications").catch(() => []);
});

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  if (!query) return rows.value;
  return rows.value.filter((p) => {
    const parts = [
      pickText(p, "title"),
      pickText(p, "abstract"),
      p.venue ?? "",
      p.externalUrl
    ]
      .join(" ")
      .toLowerCase();
    return parts.includes(query);
  });
});

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function tagList(p: Publication): string[] {
  const tags = p.tags;
  if (Array.isArray(tags)) return tags.map((t) => String(t));
  return [];
}

function fallbackTitle(p: Publication): string {
  return locale.value === "zh" ? "（未命名条目）" : "(Untitled)";
}
</script>
