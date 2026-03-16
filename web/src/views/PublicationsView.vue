<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <!-- <div class="text-xs tracking-widest uppercase opacity-70">Publications</div> -->
        <h1 class="text-3xl font-semibold mt-2" style="text-align: center;">
          <!-- {{ locale === 'zh' ? '文章与出版物' : 'Publications' }} -->
            Publications
        </h1>

      </div>

      <input
        v-model="q"
        class="input rounded-lg px-4 py-2 text-sm w-full sm:w-72"
        :placeholder="locale === 'zh' ? '搜索标题/会议...' : 'Search title/venue...'"
      />
    </div>

    <div class="mt-6 grid grid-cols-1 gap-4">
      <PublicationCard v-for="p in filtered" :key="p.id" :row="p" />

      <div v-if="!filtered.length" class="card rounded-xl2 p-6 text-sm opacity-80">
        {{ locale === 'zh' ? '暂无匹配条目。' : 'No matching items.' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { apiGet } from "../lib/api";
import { getLocale } from "../i18n";
import PublicationCard from "../components/PublicationCard.vue";

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
      (locale.value === "zh" ? p.titleZh : p.titleEn) ?? p.titleZh ?? p.titleEn ?? "",
      (locale.value === "zh" ? p.abstractZh : p.abstractEn) ?? p.abstractZh ?? p.abstractEn ?? "",
      p.venue ?? "",
      p.externalUrl
    ]
      .join(" ")
      .toLowerCase();
    return parts.includes(query);
  });
});
</script>
