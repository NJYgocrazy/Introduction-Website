<template>
  <div class="card rounded-xl2 p-6">
    <div class="flex items-center justify-between gap-4">
      <div>
        <div class="text-xs tracking-widest uppercase opacity-70">Admin</div>
        <h2 class="text-xl font-semibold mt-2">{{ title }}</h2>
      </div>
      <button class="btn rounded-lg px-4 py-2 text-sm" @click="load" :disabled="loading">
        {{ loading ? '...' : (locale === 'zh' ? '刷新' : 'Refresh') }}
      </button>
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="f in fields" :key="f.key">
        <div class="text-xs opacity-70 mb-1">{{ f.label }}</div>

        <template v-if="f.type === 'textarea'">
          <textarea v-model="form[f.key]" class="input rounded-lg px-3 py-2 w-full min-h-[110px] text-sm" />
        </template>

        <template v-else-if="f.type === 'json'">
          <textarea v-model="form[f.key]" class="input rounded-lg px-3 py-2 w-full min-h-[110px] text-sm mono" />
        </template>

        <template v-else>
          <input v-model="form[f.key]" type="text" class="input rounded-lg px-3 py-2 w-full text-sm" />
        </template>
      </div>
    </div>

    <div class="mt-5 flex items-center gap-2">
      <button class="btn btn-primary rounded-lg px-4 py-2 text-sm" :disabled="loading" @click="save">
        {{ loading ? '...' : (locale === 'zh' ? '保存' : 'Save') }}
      </button>
      <div v-if="error" class="text-sm" style="color: rgb(160 30 30)">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

import type { FieldDef } from "./CrudManager.vue";
import { apiAdminGet, apiAdminPut } from "../../lib/api";
import { getLocale } from "../../i18n";

const props = defineProps<{ title: string; token: string; path: string; fields: FieldDef[] }>();

const locale = computed(() => getLocale());
const loading = ref(false);
const error = ref("");
const form = reactive<Record<string, any>>({});

onMounted(() => {
  initForm();
  void load();
});

function initForm() {
  for (const k of Object.keys(form)) delete form[k];
  for (const f of props.fields) {
    form[f.key] = f.type === "json" ? "" : "";
  }
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    const data = await apiAdminGet<any>(props.path, props.token);
    for (const f of props.fields) {
      const v = data?.[f.key];
      if (f.type === "json") {
        form[f.key] = v === null || v === undefined ? "" : JSON.stringify(v, null, 2);
      } else {
        form[f.key] = v ?? "";
      }
    }
  } catch (e: any) {
    error.value = String(e?.message ?? e);
  } finally {
    loading.value = false;
  }
}

function buildPayload(): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const f of props.fields) {
    const raw = form[f.key];
    if (f.type === "json") {
      const text = String(raw ?? "").trim();
      payload[f.key] = text ? JSON.parse(text) : undefined;
    } else {
      const text = String(raw ?? "").trim();
      payload[f.key] = text ? text : undefined;
    }
  }
  return payload;
}

async function save() {
  loading.value = true;
  error.value = "";
  try {
    const payload = buildPayload();
    await apiAdminPut(props.path, props.token, payload);
    await load();
  } catch (e: any) {
    error.value = String(e?.message ?? e);
  } finally {
    loading.value = false;
  }
}
</script>
