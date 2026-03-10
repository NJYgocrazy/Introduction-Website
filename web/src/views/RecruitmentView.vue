<template>
  <div>
    <div>
      <div class="text-xs tracking-widest uppercase opacity-70">Recruitment</div>
      <h1 class="text-3xl font-semibold mt-2">{{ locale === 'zh' ? '招聘信息' : 'Recruitment' }}</h1>
      <p class="text-sm opacity-80 mt-2">
        {{ locale === 'zh' ? '欢迎加入我们，一起做有影响力的研究。' : 'Join us and build impactful research together.' }}
      </p>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-4">
      <div v-for="r in rows" :key="r.id" class="card rounded-xl2 p-6">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div class="text-xl font-semibold">{{ pickText(r, 'title') }}</div>
            <div class="text-sm opacity-85 mt-3 leading-6 whitespace-pre-line">{{ pickText(r, 'content') }}</div>
          </div>

          <a
            v-if="r.applyUrl"
            class="btn btn-primary rounded-lg px-4 py-2 text-sm h-fit"
            :href="r.applyUrl"
            target="_blank"
            rel="noreferrer"
          >
            {{ locale === 'zh' ? '申请 / 联系' : 'Apply / Contact' }}
          </a>
        </div>
      </div>

      <div v-if="!rows.length" class="card rounded-xl2 p-6 text-sm opacity-80">
        {{ locale === 'zh' ? '暂无开放招聘信息。' : 'No open positions right now.' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { apiGet } from "../lib/api";
import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type RecruitmentPost = {
  id: number;
  titleZh: string;
  titleEn: string;
  contentZh: string;
  contentEn: string;
  applyUrl?: string | null;
};

const locale = computed(() => getLocale());
const rows = ref<RecruitmentPost[]>([]);

onMounted(async () => {
  rows.value = await apiGet<RecruitmentPost[]>("/public/recruitment").catch(() => []);
});
</script>
