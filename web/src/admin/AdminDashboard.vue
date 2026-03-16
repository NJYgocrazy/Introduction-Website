<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <div class="text-xs tracking-widest uppercase opacity-70">Admin</div>
        <h1 class="text-3xl font-semibold mt-2">{{ t('admin.dashboard') }}</h1>
        <p class="text-sm opacity-80 mt-2">
          {{ 'Changes affect the public site immediately.' }}
        </p>
      </div>

      <div class="flex gap-2">
        <button class="btn rounded-lg px-4 py-2 text-sm" @click="logout">
          {{ t('common.logout') }}
        </button>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <aside class="lg:col-span-3 card rounded-xl2 p-4">
        <div class="text-xs tracking-widest uppercase opacity-70 mb-3">Sections</div>
        <button
          v-for="s in sections"
          :key="s.key"
          class="w-full text-left btn rounded-lg px-3 py-2 text-sm mb-2 hover:opacity-90"
          :class="s.key === active ? 'btn-primary' : ''"
          @click="active = s.key"
        >
          {{ s.label }}
        </button>

        <div class="mt-4">
          <UploadWidget :token="token" :label="t('admin.sections.upload')" />
        </div>
      </aside>

      <section class="lg:col-span-9 space-y-6">
        <SingletonEditor
          v-if="active === 'lab'"
          :title="t('admin.sections.lab')"
          :token="token"
          path="/admin/lab-profile"
          :fields="labFields"
        />

        <CrudManager
          v-else-if="active === 'carousel'"
          :title="t('admin.sections.carousel')"
          :token="token"
          resource="/admin/carousel"
          :fields="carouselFields"
        />

        <CrudManager
          v-else-if="active === 'areas'"
          :title="t('admin.sections.areas')"
          :token="token"
          resource="/admin/research-areas"
          :fields="areaFields"
        />

        <CrudManager
          v-else-if="active === 'projects'"
          :title="t('admin.sections.projects')"
          :token="token"
          resource="/admin/research-projects"
          :fields="projectFields"
        />

        <CrudManager
          v-else-if="active === 'publications'"
          :title="t('admin.sections.publications')"
          :token="token"
          resource="/admin/publications"
          :fields="publicationFields"
        />

        <CrudManager
          v-else-if="active === 'people'"
          :title="t('admin.sections.people')"
          :token="token"
          resource="/admin/people"
          :fields="peopleFields"
          :hint="'publicationIds as JSON array, e.g. [1,2]'"
        />

        <CrudManager
          v-else-if="active === 'awards'"
          :title="t('admin.sections.awards')"
          :token="token"
          resource="/admin/awards"
          :fields="awardFields"
        />

        <CrudManager
          v-else-if="active === 'recruitment'"
          :title="t('admin.sections.recruitment')"
          :token="token"
          resource="/admin/recruitment"
          :fields="recruitmentFields"
        />

        <SingletonEditor
          v-else-if="active === 'contact'"
          :title="t('admin.sections.contact')"
          :token="token"
          path="/admin/contact"
          :fields="contactFields"
        />
      </section>
    </div>

    <div v-if="fatal" class="card rounded-xl2 p-6 text-sm" style="color: rgb(160 30 30)">
      {{ fatal }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { apiAdminGet } from "../lib/api";
import { getLocale } from "../i18n";
import { useAuthStore } from "../stores/auth";

import CrudManager, { type FieldDef } from "./components/CrudManager.vue";
import SingletonEditor from "./components/SingletonEditor.vue";
import UploadWidget from "./components/UploadWidget.vue";

const { t } = useI18n();
const router = useRouter();
const auth = useAuthStore();

const locale = computed(() => getLocale());
const token = computed(() => auth.token);

const fatal = ref("");
const active = ref<
  "lab" | "carousel" | "areas" | "projects" | "publications" | "people" | "awards" | "recruitment" | "contact"
>("lab");

const sections = computed(() => [
  { key: "lab", label: t("admin.sections.lab") },
  { key: "carousel", label: t("admin.sections.carousel") },
  { key: "areas", label: t("admin.sections.areas") },
  { key: "projects", label: t("admin.sections.projects") },
  { key: "publications", label: t("admin.sections.publications") },
  { key: "people", label: t("admin.sections.people") },
  { key: "awards", label: t("admin.sections.awards") },
  { key: "recruitment", label: t("admin.sections.recruitment") },
  { key: "contact", label: t("admin.sections.contact") }
]);

const labFields: FieldDef[] = [
  { key: "nameZh", label: "nameZh", type: "text" },
  { key: "nameEn", label: "nameEn", type: "text" },
  { key: "introZh", label: "introZh", type: "textarea" },
  { key: "introEn", label: "introEn", type: "textarea" }
];

const contactFields: FieldDef[] = [
  { key: "addressZh", label: "addressZh", type: "textarea" },
  { key: "addressEn", label: "addressEn", type: "textarea" },
  { key: "email", label: "email", type: "text" },
  { key: "phone", label: "phone", type: "text" },
  { key: "links", label: "links (json)", type: "json" }
];

const carouselFields: FieldDef[] = [
  { key: "imageUrl", label: "imageUrl", type: "url" }
];

const areaFields: FieldDef[] = [
  { key: "nameZh", label: "nameZh", type: "text" },
  { key: "nameEn", label: "nameEn", type: "text" },
  { key: "descZh", label: "descZh", type: "textarea" },
  { key: "descEn", label: "descEn", type: "textarea" },
  { key: "imageUrl", label: "imageUrl", type: "url" },
  { key: "ord", label: "ord", type: "number" }
];

const projectFields: FieldDef[] = [
  { key: "titleZh", label: "titleZh", type: "text" },
  { key: "titleEn", label: "titleEn", type: "text" },
  { key: "imageUrl", label: "imageUrl", type: "url" },
  { key: "linkUrl", label: "linkUrl", type: "url" },
  { key: "enabled", label: "enabled", type: "checkbox" },
  { key: "ord", label: "ord", type: "number" }
];

const publicationFields: FieldDef[] = [
  { key: "titleZh", label: "titleZh", type: "text" },
  { key: "titleEn", label: "titleEn", type: "text" },
  { key: "abstractZh", label: "abstractZh", type: "textarea" },
  { key: "abstractEn", label: "abstractEn", type: "textarea" },
  { key: "externalUrl", label: "externalUrl", type: "url" },
];

const peopleFields: FieldDef[] = [
  { key: "role", label: "role", type: "text" },
  { key: "nameZh", label: "nameZh", type: "text" },
  { key: "nameEn", label: "nameEn", type: "text" },
  { key: "titleZh", label: "titleZh", type: "text" },
  { key: "titleEn", label: "titleEn", type: "text" },
  { key: "bioZh", label: "bioZh", type: "textarea" },
  { key: "bioEn", label: "bioEn", type: "textarea" },
  { key: "avatarUrl", label: "avatarUrl", type: "url" },
  { key: "email", label: "email", type: "text" },
  { key: "websiteUrl", label: "websiteUrl", type: "url" },
  { key: "links", label: "links (json)", type: "json" },
  { key: "ord", label: "ord", type: "number" },
  { key: "publicationIds", label: "publicationIds (json)", type: "json" }
];

const awardFields: FieldDef[] = [
  { key: "titleZh", label: "titleZh", type: "text" },
  { key: "titleEn", label: "titleEn", type: "text" },
  { key: "imageUrl", label: "imageUrl", type: "url" },
  { key: "personId", label: "personId", type: "number" }
];

const recruitmentFields: FieldDef[] = [
  { key: "titleZh", label: "titleZh", type: "text" },
  { key: "titleEn", label: "titleEn", type: "text" },
  { key: "contentZh", label: "contentZh", type: "textarea" },
  { key: "contentEn", label: "contentEn", type: "textarea" },
  { key: "applyUrl", label: "applyUrl", type: "url" },
  { key: "isOpen", label: "isOpen", type: "checkbox" },
  { key: "ord", label: "ord", type: "number" }
];

onMounted(async () => {
  fatal.value = "";
  try {
    await apiAdminGet("/admin/auth/me", token.value);
  } catch (e: any) {
    auth.logout();
    fatal.value = String(e?.message ?? e);
    await router.push("/admin/login");
  }
});

async function logout() {
  auth.logout();
  await router.push("/");
}
</script>




