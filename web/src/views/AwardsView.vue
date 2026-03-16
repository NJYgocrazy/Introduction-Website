<template>
  <div>
    <div>
      <h1 class="text-3xl font-semibold mt-2">{{ locale === "zh" ? "奖项与成就" : "Awards & Achievements" }}</h1>
      <p class="text-sm opacity-80 mt-2">
        {{ locale === "zh" ? "记录我们的里程碑与荣誉。" : "Milestones and recognitions." }}
      </p>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="a in rows" :key="a.id" class="card rounded-xl2 overflow-hidden">
        <div v-if="a.imageUrl" class="h-36 bg-center bg-cover" :style="{ backgroundImage: `url(${a.imageUrl})` }" />
        <div class="p-5">
          <div class="font-semibold">{{ pickText(a, "title") }}</div>
        </div>
      </div>

      <div v-if="!rows.length" class="card rounded-xl2 p-6 text-sm opacity-80">
        {{ locale === "zh" ? "暂无奖项记录。" : "No awards yet." }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { apiGet } from "../lib/api";
import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type Award = {
  id: number;
  titleZh: string;
  titleEn: string;
  imageUrl?: string | null;
};

const locale = computed(() => getLocale());
const rows = ref<Award[]>([]);

onMounted(async () => {
  rows.value = await apiGet<Award[]>("/public/awards").catch(() => []);
});
</script>