<template>
  <div class="relative">
    <!-- 1. 顶部轮播图 -->
    <div class="relative h-[400px] lg:h-[500px] overflow-hidden">
      <Carousel v-if="carousel.length" variant="hero" :images="carousel" class="h-full w-full" />
    </div>

    <!-- 2. 悬浮的实验室介绍卡片 -->
    <div class="container mx-auto px-4 -mt-24 relative z-10">
      <section class="card rounded-xl2 p-8 lg:p-10 bg-white/95 backdrop-blur-sm shadow-xl">
        <div class="text-xs tracking-widest uppercase opacity-70">About</div>
        <h2 class="text-3xl font-semibold mt-2">{{ labName }}</h2>
        <p class="text-base leading-7 opacity-85 mt-4 whitespace-pre-line max-w-4xl">
          {{ labIntro }}
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink class="btn btn-primary rounded-lg px-5 py-3 text-sm" to="/people">
            {{ locale === 'zh' ? '认识团队' : 'Meet the Team' }}
          </RouterLink>
          <RouterLink class="btn rounded-lg px-5 py-3 text-sm" to="/publications">
            {{ locale === 'zh' ? '查看文章' : 'View Publications' }}
          </RouterLink>
        </div>
      </section>
    </div>

    <!-- 3. 下方文章列表（复用现有样式） -->
    <div class="container mx-auto px-4 mt-12">
      <section>
        <div class="flex items-end justify-between gap-4 mb-6">
          <div>
            <div class="text-xs tracking-widest uppercase opacity-70">News</div>
            <h2 class="text-2xl font-semibold mt-2">{{ locale === 'zh' ? '最新动态' : 'Latest News' }}</h2>
          </div>
        </div>

        <!-- 文章列表：与参考图样式一致 -->
        <div class="space-y-4">
          <div v-for="item in newsList" :key="item.id"
            class="card rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div class="flex flex-col md:flex-row md:items-start gap-6">
              <div class="flex-1">
                <h3 class="text-2xl font-semibold text-purple-800 mb-2">
                  {{ pickNewsTitle(item) }}
                </h3>
                <div class="text-sm text-gray-500 mb-3">{{ formatDate(item.date) }}</div>
                <p class="text-base text-gray-700 leading-7">
                  {{ pickNewsDesc(item) }}
                </p>
              </div>
              <div v-if="item.imageUrl" class="w-full md:w-48 h-32 flex-shrink-0">
                <img :src="item.imageUrl" :alt="pickNewsTitle(item)" class="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. 探索更多区域（保留原样式） -->
      <section class="mt-12 card rounded-xl2 p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div class="text-xs tracking-widest uppercase opacity-70">Explore</div>
            <div class="text-xl font-semibold mt-2">
              {{ locale === 'zh' ? '想了解更多？' : 'Want to know more?' }}
            </div>
            <div class="text-sm opacity-80 mt-2 max-w-md">
              {{ locale === 'zh' ? '浏览奖项成就与招聘信息。' : 'Browse awards and recruitment info.' }}
            </div>
          </div>
          <div class="flex gap-3">
            <RouterLink class="btn rounded-lg px-5 py-3 text-sm" to="/awards">
              {{ locale === 'zh' ? '奖项成就' : 'Awards' }}
            </RouterLink>
            <RouterLink class="btn rounded-lg px-5 py-3 text-sm" to="/recruitment">
              {{ locale === 'zh' ? '招聘信息' : 'Recruitment' }}
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
// import dayjs from "dayjs"; // 若已安装可直接使用

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

// 复用你现有的接口结构，定义新闻/文章类型
type NewsItem = {
  id: number;
  titleZh: string;
  titleEn: string;
  descZh?: string | null;
  descEn?: string | null;
  imageUrl?: string | null;
  date: string; // 格式：YYYY-MM-DD
};

const locale = computed(() => getLocale());

const lab = ref<LabProfile | null>(null);
const carousel = ref<CarouselImage[]>([]);
const areas = ref<ResearchArea[]>([]);
// 文章列表数据（可复用 /public/highlights 或 /public/news 接口）
const newsList = ref<NewsItem[]>([]);

onMounted(async () => {
  try {
    const [labData, carouselData, areasData, newsData] = await Promise.all([
      apiGet<LabProfile>("/public/lab-profile"),
      apiGet<CarouselImage[]>("/public/carousel"),
      apiGet<ResearchArea[]>("/public/research-areas"),
      // 这里可以替换为你现有的动态/文章接口，比如 /public/highlights
      apiGet<NewsItem[]>("/public/highlights")
    ]);

    lab.value = labData;
    carousel.value = Array.isArray(carouselData) ? carouselData : [];
    areas.value = Array.isArray(areasData) ? areasData : [];
    newsList.value = Array.isArray(newsData) ? newsData : [];
  } catch (error) {
    console.error("Failed to load data:", error);
    lab.value = null;
    carousel.value = [];
    areas.value = [];
    newsList.value = [];
  }
});

const labName = computed(() => (lab.value ? pickText(lab.value, "name") : ""));
const labIntro = computed(() => (lab.value ? pickText(lab.value, "intro") : ""));

function pickAreaName(a: ResearchArea) {
  return pickText(a, "name");
}
function pickAreaDesc(a: ResearchArea) {
  return pickText(a, "desc");
}

// 复用国际化工具函数获取文章标题和描述
function pickNewsTitle(n: NewsItem) {
  return pickText(n, "title");
}
function pickNewsDesc(n: NewsItem) {
  return pickText(n, "desc") || "";
}

// 日期格式化（与参考图 Sep 23, 2025 格式一致）
function formatDate(dateStr: string) {
  return dayjs(dateStr).format(locale.value === 'zh' ? 'YYYY年MM月DD日' : 'MMM D, YYYY');
}
</script>

<style scoped>
/* 适配参考图的文字颜色与间距 */
.text-purple-800 {
  color: #6b21a8;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}
</style>