<template>
  <div class="relative">
    <div class="full-bleed relative w-full h-[420px] lg:h-[520px] overflow-hidden z-0">
      <Carousel v-if="carousel.length" variant="hero" :rounded="false" :images="carousel" class="h-full w-full" />
      <div
        v-else
        class="h-full w-full flex items-end"
        style="background: linear-gradient(135deg, rgba(15,58,120,0.90), rgba(15,23,42,0.85))"
      >
        <div class="max-w-6xl mx-auto w-full px-4 sm:px-8 pb-10" style="color: rgba(255,255,255,0.98)">
          <div class="text-xs tracking-widest uppercase opacity-85">
            {{ locale === "zh" ? "研究实验室" : "Research Lab" }}
          </div>
          <div class="text-3xl sm:text-5xl font-semibold leading-tight mt-3">
            {{ labName || "Lab" }}
          </div>
          <div class="text-sm sm:text-base opacity-90 mt-3 max-w-2xl">
            {{ locale === "zh" ? "面向实验室招聘与科研展示。" : "Recruitment and research showcase." }}
          </div>
        </div>
      </div>
    </div>

    <div class="-mt-20 relative z-10">
      <section class="about-card card rounded-xl2 p-8 lg:p-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-8">
            <div class="text-xs tracking-widest uppercase opacity-70">About</div>
            <h2 class="text-3xl font-semibold mt-2">{{ labName || (locale === "zh" ? "实验室" : "Lab") }}</h2>
            <div class="text-base leading-7 mt-4" style="color: rgb(var(--c-muted))" v-html="labIntroHtml" />
          </div>

          <aside class="lg:col-span-4">
            <div class="rounded-xl border p-5" style="border-color: rgb(var(--c-border))">
              <!-- <div class="text-xs tracking-widest uppercase" style="color: rgb(var(--c-muted))">
                {{ locale === "zh" ? "概览" : "At a Glance" }}
              </div>
              <div class="mt-3 space-y-2 text-sm" style="color: rgb(var(--c-muted))">
                <div class="flex items-center justify-between gap-3">
                  <span>{{ locale === "zh" ? "研究方向" : "Research Areas" }}</span>
                  <span class="mono">{{ areaCount }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span>{{ locale === "zh" ? "科研项目" : "Projects" }}</span>
                  <span class="mono">{{ projectCount }}</span>
                </div>
              </div> -->

              <div class="mt-5 grid grid-cols-1 gap-2">
                <RouterLink class="btn btn-primary rounded-lg px-4 py-2.5 text-sm" to="/recruitment">
                  {{ locale === "zh" ? "加入我们" : "Join Us" }}
                </RouterLink>
                <RouterLink class="btn rounded-lg px-4 py-2.5 text-sm" to="/people">
                  {{ locale === "zh" ? "认识团队" : "Meet the Team" }}
                </RouterLink>
                <RouterLink class="btn rounded-lg px-4 py-2.5 text-sm" to="/publications">
                  {{ locale === "zh" ? "查看文章" : "View Publications" }}
                </RouterLink>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>

    <div class="mt-12 full-bleed px-4 sm:px-8">
      <div class="mx-auto max-w-[1400px]">
      <section>
        <div class="text-center mb-6">
          <!-- <div class="text-xs tracking-widest uppercase opacity-70">Research</div> -->
          <h2 class="text-2xl font-semibold mt-2">
            <!-- {{ locale === "zh" ? "研究方向与科研项目" : "Research Areas & Projects" }} -->
              Research
          </h2>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <ResearchAreaCard v-for="item in visibleResearchAreaCards" :key="item.key" :row="item" />
          <div v-if="!visibleResearchAreaCards.length" class="card rounded-xl2 p-6 text-sm opacity-80">
            {{ locale === "zh" ? "暂无研究内容。" : "No research content yet." }}
          </div>
        </div>
      </section>

      <section class="mt-12 card rounded-xl2 p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div class="text-xs tracking-widest uppercase opacity-70">Explore</div>
            <div class="text-xl font-semibold mt-2">
              {{ locale === "zh" ? "想了解更多？" : "Want to know more?" }}
            </div>
            <div class="text-sm opacity-80 mt-2 max-w-md">
              {{ locale === "zh" ? "浏览奖项成就与招聘信息。" : "Browse awards and recruitment info." }}
            </div>
          </div>
          <div class="flex gap-3">
            <RouterLink class="btn rounded-lg px-5 py-3 text-sm" to="/awards">
              {{ locale === "zh" ? "奖项成就" : "Awards" }}
            </RouterLink>
            <RouterLink class="btn rounded-lg px-5 py-3 text-sm" to="/recruitment">
              {{ locale === "zh" ? "招聘信息" : "Recruitment" }}
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import Carousel, { type CarouselImage } from "../components/Carousel.vue";
import ResearchAreaCard from "../components/ResearchAreaCard.vue";
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
  imageUrl?: string | null;
  ord?: number;
};

type ResearchProject = {
  id: number;
  titleZh: string;
  titleEn: string;
  descZh?: string | null;
  descEn?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ord?: number;
  enabled?: boolean;
};

type ResearchAreaCardRow = {
  key: string;
  id: number;
  nameZh: string;
  nameEn: string;
  descZh?: string | null;
  descEn?: string | null;
  imageUrl?: string | null;
};

const locale = computed(() => getLocale());

const lab = ref<LabProfile | null>(null);
const carousel = ref<CarouselImage[]>([]);
const researchAreas = ref<ResearchArea[]>([]);
const projects = ref<ResearchProject[]>([]);

onMounted(async () => {
  const results = await Promise.allSettled([
    apiGet<LabProfile>("/public/lab-profile"),
    apiGet<CarouselImage[]>("/public/carousel"),
    apiGet<ResearchArea[]>("/public/research-areas"),
    apiGet<ResearchProject[]>("/public/research-projects")
  ]);

  const [labRes, carouselRes, areasRes, projectsRes] = results;

  lab.value = labRes.status === "fulfilled" ? labRes.value : null;
  carousel.value =
    carouselRes.status === "fulfilled" && Array.isArray(carouselRes.value) ? carouselRes.value : [];
  researchAreas.value =
    areasRes.status === "fulfilled" && Array.isArray(areasRes.value) ? areasRes.value : [];
  projects.value =
    projectsRes.status === "fulfilled" && Array.isArray(projectsRes.value) ? projectsRes.value : [];
});

const labName = computed(() => (lab.value ? pickText(lab.value, "name") : ""));

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function linkifyPlainText(s: string) {
  const escaped = escapeHtml(s);
  const urlRegex = /\bhttps?:\/\/[^\s<]+[^\s<\.)\]]/g;
  return escaped.replace(urlRegex, (url) => {
    const safe = url;
    return `<a href="${safe}" target="_blank" rel="noreferrer" style="color: rgb(var(--c-accent)); text-decoration: underline; text-underline-offset: 3px;">${safe}</a>`;
  });
}

const labIntroHtml = computed(() => {
  const raw = lab.value ? pickText(lab.value, "intro") : "";
  if (!raw) return "";
  const lines = raw.replaceAll("\r\n", "\n").split("\n");
  let html = "";
  let list: "ul" | "ol" | null = null;

  function closeList() {
    if (!list) return;
    html += list === "ul" ? "</ul>" : "</ol>";
    list = null;
  }

  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line) {
      closeList();
      html += '<div style="height: 10px"></div>';
      continue;
    }

    const bullet = /^[-•]\s+(.+)$/.exec(line);
    const ordered = /^(\d+)\.\s+(.+)$/.exec(line);

    if (bullet) {
      if (list !== "ul") {
        closeList();
        list = "ul";
        html += '<ul style="margin-top: 6px; padding-left: 18px; list-style: disc;">';
      }
      html += `<li style="margin-top: 6px">${linkifyPlainText(bullet[1] ?? "")}</li>`;
      continue;
    }

    if (ordered) {
      if (list !== "ol") {
        closeList();
        list = "ol";
        html += '<ol style="margin-top: 6px; padding-left: 18px; list-style: decimal;">';
      }
      html += `<li style="margin-top: 6px">${linkifyPlainText(ordered[2] ?? "")}</li>`;
      continue;
    }

    closeList();
    html += `<p style="margin-top: 6px">${linkifyPlainText(line)}</p>`;
  }

  closeList();
  return html;
});

const areaCount = computed(() => researchAreas.value.length);
const projectCount = computed(() => projects.value.length);

const visibleResearchAreaCards = computed<ResearchAreaCardRow[]>(() =>
  researchAreas.value.slice(0, 12).map((item) => ({
    key: `area-${item.id}`,
    id: item.id,
    nameZh: item.nameZh,
    nameEn: item.nameEn,
    descZh: item.descZh,
    descEn: item.descEn,
    imageUrl: item.imageUrl
  }))
);
</script>

<style scoped>
.about-card {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}
</style>







