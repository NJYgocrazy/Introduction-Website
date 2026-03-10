<template>
  <div v-if="person" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <section class="card rounded-xl2 p-6 lg:col-span-4">
      <div class="flex items-center gap-4">
        <div class="h-20 w-20 rounded-full overflow-hidden" style="border: 1px solid rgba(0,0,0,0.10)">
          <img v-if="person.avatarUrl" :src="person.avatarUrl" class="h-full w-full object-cover" alt="avatar" />
        </div>
        <div class="min-w-0">
          <div class="text-2xl font-semibold truncate">{{ pickText(person, 'name') }}</div>
          <div class="text-sm opacity-80 truncate">{{ pickText(person, 'title') }}</div>
          <div class="text-xs opacity-60 mt-1">{{ person.role }}</div>
        </div>
      </div>

      <div class="mt-5 text-sm leading-6 opacity-85 whitespace-pre-line">
        {{ pickText(person, 'bio') }}
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <a
          v-if="person.websiteUrl"
          class="btn rounded-lg px-3 py-2 text-sm"
          :href="person.websiteUrl"
          target="_blank"
          rel="noreferrer"
        >
          Website
        </a>
        <a
          v-if="person.email"
          class="btn rounded-lg px-3 py-2 text-sm"
          :href="`mailto:${person.email}`"
        >
          Email
        </a>
        <a
          v-for="[k, v] in linkEntries"
          :key="k"
          class="btn rounded-lg px-3 py-2 text-sm"
          :href="String(v)"
          target="_blank"
          rel="noreferrer"
        >
          {{ k }}
        </a>
      </div>

      <RouterLink class="btn btn-primary rounded-lg px-4 py-2 text-sm mt-6 inline-block" to="/people">
        {{ locale === 'zh' ? '返回人员列表' : 'Back to People' }}
      </RouterLink>
    </section>

    <section class="lg:col-span-8 space-y-6">
      <div class="card rounded-xl2 p-6">
        <div class="text-xs tracking-widest uppercase opacity-70">Publications</div>
        <h2 class="text-xl font-semibold mt-2">{{ locale === 'zh' ? '文章发布' : 'Publications' }}</h2>

        <div class="mt-4 grid grid-cols-1 gap-3" v-if="publications.length">
          <a
            v-for="p in publications"
            :key="p.id"
            class="btn rounded-lg px-4 py-3 text-left hover:opacity-90"
            :href="p.externalUrl"
            target="_blank"
            rel="noreferrer"
          >
            <div class="font-semibold">{{ pickText(p, 'title') || fallbackTitle }}</div>
            <div class="text-sm opacity-75 mt-1">{{ p.venue || '' }}</div>
          </a>
        </div>
        <div v-else class="text-sm opacity-75 mt-4">
          {{ locale === 'zh' ? '暂无关联文章。' : 'No linked publications yet.' }}
        </div>
      </div>

      <div class="card rounded-xl2 p-6">
        <div class="text-xs tracking-widest uppercase opacity-70">Awards</div>
        <h2 class="text-xl font-semibold mt-2">{{ locale === 'zh' ? '奖项与荣誉' : 'Awards & Honors' }}</h2>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4" v-if="awards.length">
          <div v-for="a in awards" :key="a.id" class="btn rounded-lg p-4">
            <div class="font-semibold">{{ pickText(a, 'title') }}</div>
            <div class="text-xs opacity-60 mt-1 mono">{{ formatDate(a.date) }}</div>
            <div class="text-sm opacity-80 mt-2 leading-6">{{ pickText(a, 'desc') }}</div>
          </div>
        </div>
        <div v-else class="text-sm opacity-75 mt-4">
          {{ locale === 'zh' ? '暂无关联奖项。' : 'No linked awards yet.' }}
        </div>
      </div>
    </section>
  </div>

  <div v-else class="card rounded-xl2 p-6 text-sm opacity-80">
    {{ locale === 'zh' ? '加载中或未找到该成员。' : 'Loading or not found.' }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { apiGet } from "../lib/api";
import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type Publication = {
  id: number;
  titleZh?: string | null;
  titleEn?: string | null;
  venue?: string | null;
  externalUrl: string;
};

type Award = {
  id: number;
  titleZh: string;
  titleEn: string;
  descZh?: string | null;
  descEn?: string | null;
  date?: string | null;
};

type PersonDetail = {
  id: number;
  role: string;
  nameZh: string;
  nameEn: string;
  titleZh?: string | null;
  titleEn?: string | null;
  bioZh?: string | null;
  bioEn?: string | null;
  avatarUrl?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  links?: Record<string, unknown> | null;
  publications: Publication[];
  awards: Award[];
};

const route = useRoute();
const locale = computed(() => getLocale());

const person = ref<PersonDetail | null>(null);
const publications = computed(() => person.value?.publications ?? []);
const awards = computed(() => person.value?.awards ?? []);

const fallbackTitle = computed(() => (locale.value === "zh" ? "（未命名条目）" : "(Untitled)"));

const linkEntries = computed(() => {
  const obj = person.value?.links;
  if (!obj || typeof obj !== "object") return [] as Array<[string, unknown]>;
  return Object.entries(obj).filter(([, v]) => typeof v === "string" && String(v).startsWith("http"));
});

async function load() {
  person.value = null;
  const id = Number(route.params.id);
  if (!Number.isFinite(id)) return;
  person.value = await apiGet<PersonDetail>(`/public/people/${id}`).catch(() => null);
}

onMounted(load);
watch(() => route.params.id, load);

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
</script>
