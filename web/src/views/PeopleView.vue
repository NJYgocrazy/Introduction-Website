<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <div class="text-xs tracking-widest uppercase opacity-70">People</div>
        <h1 class="text-3xl font-semibold mt-2">{{ locale === 'zh' ? '团队成员' : 'People' }}</h1>
        <p class="text-sm opacity-80 mt-2">
          {{ locale === 'zh' ? '点击进入个人主页。' : 'Click to open the profile page.' }}
        </p>
      </div>

      <input
        v-model="q"
        class="input rounded-lg px-4 py-2 text-sm w-full sm:w-72"
        :placeholder="locale === 'zh' ? '搜索姓名/头衔...' : 'Search name/title...'"
      />
    </div>

    <div class="mt-6 grid grid-cols-1 gap-8">
      <section v-for="group in groups" :key="group.role">
        <div class="flex items-baseline justify-between">
          <h2 class="text-xl font-semibold">
            {{ roleLabel(group.role) }}
          </h2>
          <div class="text-xs opacity-60">{{ group.items.length }}</div>
        </div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="p in group.items"
            :key="p.id"
            class="card rounded-xl2 p-5 hover:opacity-95 transition-opacity"
            :to="`/people/${p.id}`"
          >
            <div class="flex items-center gap-4">
              <div
                class="h-12 w-12 rounded-full overflow-hidden"
                style="border: 1px solid rgba(0,0,0,0.10); background: rgba(255,255,255,0.55)"
              >
                <img
                  v-if="p.avatarUrl"
                  :src="p.avatarUrl"
                  alt="avatar"
                  class="h-full w-full object-cover"
                />
              </div>

              <div class="min-w-0">
                <div class="font-semibold truncate">{{ pickText(p, 'name') }}</div>
                <div class="text-sm opacity-75 truncate">{{ pickText(p, 'title') }}</div>
              </div>
            </div>

            <div class="mt-3 text-sm opacity-80 leading-6 line-clamp-3">
              {{ pickText(p, 'bio') }}
            </div>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

import { apiGet } from "../lib/api";
import { pickText } from "../lib/fields";
import { getLocale } from "../i18n";

type Person = {
  id: number;
  role: string;
  nameZh: string;
  nameEn: string;
  titleZh?: string | null;
  titleEn?: string | null;
  bioZh?: string | null;
  bioEn?: string | null;
  avatarUrl?: string | null;
};

const locale = computed(() => getLocale());
const rows = ref<Person[]>([]);
const q = ref("");

onMounted(async () => {
  rows.value = await apiGet<Person[]>("/public/people").catch(() => []);
});

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  if (!query) return rows.value;
  return rows.value.filter((p) => {
    const parts = [pickText(p, "name"), pickText(p, "title"), pickText(p, "bio")]
      .join(" ")
      .toLowerCase();
    return parts.includes(query);
  });
});

const groups = computed(() => {
  const byRole = new Map<string, Person[]>();
  for (const p of filtered.value) {
    const arr = byRole.get(p.role) ?? [];
    arr.push(p);
    byRole.set(p.role, arr);
  }

  const order = ["teacher", "faculty", "student", "phd", "master", "alumni", "other"];
  const roles = Array.from(byRole.keys()).sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return roles.map((role) => ({ role, items: byRole.get(role) ?? [] }));
});

function roleLabel(role: string) {
  const r = role.toLowerCase();
  if (locale.value === "zh") {
    if (r === "teacher" || r === "faculty") return "老师";
    if (r === "student" || r === "phd" || r === "master") return "学生";
    if (r === "alumni") return "校友";
    return "成员";
  }

  if (r === "teacher") return "Faculty";
  if (r === "faculty") return "Faculty";
  if (r === "student") return "Students";
  if (r === "phd") return "PhD Students";
  if (r === "master") return "Master Students";
  if (r === "alumni") return "Alumni";
  return "People";
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
