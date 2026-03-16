<template>
  <div>
    <div>
      <h1 class="text-3xl font-semibold mt-2">
        <!-- {{ locale === 'zh' ? '招聘信息' : 'Recruitment' }} -->
          Recruitment
      </h1>
      <p class="text-sm opacity-80 mt-2">
        {{ locale === 'zh' ? '欢迎加入我们，一起做有影响力的研究。' : 'Join us and build impactful research together.' }}
      </p>
    </div>

    <div class="mt-8 space-y-8">
      <article v-for="r in rows" :key="r.id" class="pb-6 border-b" style="border-color: rgb(var(--c-border))">
        <h2 class="text-title text-2xl font-semibold">{{ pickText(r, 'title') }}</h2>
        <p class="text-base opacity-85 mt-3 leading-8 whitespace-pre-line">{{ pickText(r, 'content') }}</p>
        <div class="flex items-center gap-2 mt-3">
          <Mail class="h-4 w-4" />
          <p class="inline">lucialee@126.com</p>
        </div>
        

        <!-- <p v-if="r.applyUrl" class="mt-3 text-sm">
          <a :href="r.applyUrl" target="_blank" rel="noreferrer" style="color: rgb(var(--c-accent)); text-decoration: underline; text-underline-offset: 3px;">
            {{ locale === 'zh' ? '申请 / 联系' : 'Apply / Contact' }}
          </a>
        </p> -->
      </article>

      <div v-if="!rows.length" class="text-sm opacity-80">
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
import { GraduationCap, Mail } from "lucide-vue-next";

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

<style scoped>
.text-title {
  color: #743481;
}
</style>
