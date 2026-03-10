<template>
  <div>
    <Carousel v-if="carousel.length" :images="carousel" />

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <section class="card rounded-xl2 p-6 lg:col-span-5">
        <div class="text-xs tracking-widest uppercase opacity-70">About</div>
        <h2 class="text-2xl font-semibold mt-2">{{ labName }}</h2>
        <p class="text-sm leading-6 opacity-85 mt-4 whitespace-pre-line">
          {{ labIntro }}
        </p>

        <div class="mt-6 flex flex-wrap gap-2">
          <RouterLink class="btn btn-primary rounded-lg px-4 py-2 text-sm" to="/people">
            {{ locale === 'zh' ? '认识团队' : 'Meet the Team' }}
          </RouterLink>
          <RouterLink class="btn rounded-lg px-4 py-2 text-sm" to="/publications">
            {{ locale === 'zh' ? '查看文章' : 'View Publications' }}
          </RouterLink>
        </div>
      </section>

      <section class="lg:col-span-7">
        <div class="flex items-end justify-between gap-4">
          <div>
            <div class="text-xs tracking-widest uppercase opacity-70">Focus</div>
            <h2 class="text-2xl font-semibold mt-2">{{ locale === 'zh' ? '研究方向' : 'Research Areas' }}</h2>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="area in areas" :key="area.id" class="card rounded-xl2 p-5">
            <div class="text-lg font-semibold">{{ pickAreaName(area) }}</div>
            <div class="text-sm opacity-80 mt-2 leading-6">{{ pickAreaDesc(area) }}</div>
          </div>
        </div>
      </section>
    </div>

    <section class="mt-10 card rounded-xl2 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="text-xs tracking-widest uppercase opacity-70">Explore</div>
          <div class="text-xl font-semibold mt-2">
            {{ locale === 'zh' ? '想了解更多？' : 'Want to know more?' }}
          </div>
          <div class="text-sm opacity-80 mt-2">
            {{ locale === 'zh' ? '浏览奖项成就与招聘信息。' : 'Browse awards and recruitment info.' }}
          </div>
        </div>
        <div class="flex gap-2">
          <RouterLink class="btn rounded-lg px-4 py-2 text-sm" to="/awards">
            {{ locale === 'zh' ? '奖项成就' : 'Awards' }}
          </RouterLink>
          <RouterLink class="btn rounded-lg px-4 py-2 text-sm" to="/recruitment">
            {{ locale === 'zh' ? '招聘信息' : 'Recruitment' }}
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

import Carousel, { type CarouselImage } from "../components/Carousel.vue";
import { apiGet } from "../lib/api";
import { getLocale } from "../i18n";
import { pickText } from "../lib/fields";

type LabProfile = {
  id: number;
  nameZh: string;
  nameEn: string;
  introZh: string;
  introEn: string;
};

type ResearchArea = {
  id: number;
  nameZh: string;
  nameEn: string;
  descZh?: string | null;
  descEn?: string | null;
};

const locale = computed(() => getLocale());

const lab = ref<LabProfile | null>(null);
const carousel = ref<CarouselImage[]>([]);
const areas = ref<ResearchArea[]>([]);

onMounted(async () => {
  const [labData, carouselData, areasData] = await Promise.all([
    apiGet<LabProfile>("/public/lab-profile"),
    apiGet<CarouselImage[]>("/public/carousel"),
    apiGet<ResearchArea[]>("/public/research-areas")
  ]).catch(() => [null, [], []] as any);

  lab.value = labData;
  carousel.value = Array.isArray(carouselData) ? carouselData : [];
  areas.value = Array.isArray(areasData) ? areasData : [];
});

const labName = computed(() => (lab.value ? pickText(lab.value, "name") : ""));
const labIntro = computed(() => (lab.value ? pickText(lab.value, "intro") : ""));

function pickAreaName(a: ResearchArea) {
  return pickText(a, "name");
}

function pickAreaDesc(a: ResearchArea) {
  return pickText(a, "desc");
}
</script>
