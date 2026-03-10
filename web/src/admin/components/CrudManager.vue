<template>
  <div class="card rounded-xl2 p-6">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <div class="text-xs tracking-widest uppercase opacity-70">Admin</div>
        <h2 class="text-xl font-semibold mt-2">{{ title }}</h2>
        <div class="text-sm opacity-75 mt-2">{{ hint }}</div>
      </div>

      <div class="flex gap-2">
        <button class="btn rounded-lg px-4 py-2 text-sm" @click="refresh" :disabled="loading">
          {{ loading ? '...' : (locale === 'zh' ? '刷新' : 'Refresh') }}
        </button>
        <button class="btn btn-primary rounded-lg px-4 py-2 text-sm" @click="startCreate">
          {{ locale === 'zh' ? '新增' : 'Create' }}
        </button>
      </div>
    </div>

    <div class="mt-6 overflow-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="opacity-70">
            <th class="text-left py-2 pr-3">ID</th>
            <th v-for="c in previewFields" :key="c.key" class="text-left py-2 pr-3">
              {{ c.label }}
            </th>
            <th class="text-left py-2 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in items" :key="it.id" style="border-top: 1px solid rgba(0,0,0,0.06)">
            <td class="py-2 pr-3 mono opacity-70">{{ it.id }}</td>
            <td v-for="c in previewFields" :key="c.key" class="py-2 pr-3">
              <span class="truncate inline-block max-w-[18rem]">{{ previewValue(it, c) }}</span>
            </td>
            <td class="py-2 pr-3 whitespace-nowrap">
              <button class="btn rounded-lg px-3 py-1.5 text-xs" @click="startEdit(it)">
                {{ locale === 'zh' ? '编辑' : 'Edit' }}
              </button>
              <button class="btn rounded-lg px-3 py-1.5 text-xs ml-2" @click="remove(it)" :disabled="loading">
                {{ locale === 'zh' ? '删除' : 'Delete' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!items.length" class="text-sm opacity-80 mt-4">
        {{ locale === 'zh' ? '暂无数据。' : 'No data.' }}
      </div>
    </div>

    <div class="mt-7" v-if="editing">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold">
          {{ editingId ? (locale === 'zh' ? '编辑' : 'Edit') : (locale === 'zh' ? '新增' : 'Create') }}
          <span v-if="editingId" class="mono opacity-60">#{{ editingId }}</span>
        </div>
        <button class="btn rounded-lg px-3 py-1.5 text-xs" @click="cancelEdit">
          {{ locale === 'zh' ? '取消' : 'Cancel' }}
        </button>
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="f in fields" :key="f.key">
          <div class="text-xs opacity-70 mb-1">{{ f.label }}</div>

          <template v-if="f.type === 'textarea'">
            <textarea v-model="form[f.key]" class="input rounded-lg px-3 py-2 w-full min-h-[110px] text-sm" />
          </template>

          <template v-else-if="f.type === 'checkbox'">
            <label class="flex items-center gap-2 text-sm">
              <input type="checkbox" v-model="form[f.key]" />
              <span class="opacity-80">{{ locale === 'zh' ? '启用/是' : 'Enabled / Yes' }}</span>
            </label>
          </template>

          <template v-else-if="f.type === 'number'">
            <input v-model.number="form[f.key]" type="number" class="input rounded-lg px-3 py-2 w-full text-sm" />
          </template>

          <template v-else-if="f.type === 'date'">
            <input v-model="form[f.key]" type="date" class="input rounded-lg px-3 py-2 w-full text-sm" />
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

import { apiAdminDelete, apiAdminGet, apiAdminPost, apiAdminPut } from "../../lib/api";
import { getLocale } from "../../i18n";

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "date" | "json" | "url";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
};

const props = defineProps<{ title: string; token: string; resource: string; fields: FieldDef[]; hint?: string }>();

const locale = computed(() => getLocale());
const hint = computed(
  () =>
    props.hint ??
    (locale.value === "zh" ? "对该模块进行增删改查。" : "Create, update, and delete records for this module.")
);

const items = ref<any[]>([]);
const loading = ref(false);
const error = ref("");

const editing = ref(false);
const editingId = ref<number | null>(null);
const form = reactive<Record<string, any>>({});

const previewFields = computed(() => props.fields.slice(0, 3));

onMounted(refresh);

async function refresh() {
  loading.value = true;
  error.value = "";
  try {
    items.value = await apiAdminGet<any[]>(props.resource, props.token);
    if (!Array.isArray(items.value)) items.value = [];
  } catch (e: any) {
    error.value = String(e?.message ?? e);
    items.value = [];
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  for (const k of Object.keys(form)) delete form[k];
  for (const f of props.fields) {
    if (f.type === "checkbox") form[f.key] = false;
    else if (f.type === "number") form[f.key] = 0;
    else if (f.type === "json") form[f.key] = "";
    else form[f.key] = "";
  }
}

function startCreate() {
  editing.value = true;
  editingId.value = null;
  error.value = "";
  resetForm();
}

function startEdit(it: any) {
  editing.value = true;
  editingId.value = Number(it.id);
  error.value = "";
  resetForm();
  for (const f of props.fields) {
    const v = it?.[f.key];
    if (f.type === "json") {
      form[f.key] = v === null || v === undefined ? "" : JSON.stringify(v, null, 2);
    } else if (f.type === "date") {
      form[f.key] = v ? String(v).slice(0, 10) : "";
    } else {
      form[f.key] = v ?? form[f.key];
    }
  }
}

function cancelEdit() {
  editing.value = false;
  editingId.value = null;
  error.value = "";
}

function buildPayload(): Record<string, any> {
  const payload: Record<string, any> = {};
  for (const f of props.fields) {
    const raw = form[f.key];

    if (f.type === "json") {
      const text = String(raw ?? "").trim();
      if (!text) {
        payload[f.key] = undefined;
        continue;
      }
      try {
        payload[f.key] = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON: ${f.label}`);
      }
      continue;
    }

    if (f.type === "number") {
      payload[f.key] = raw === "" ? undefined : Number(raw);
      continue;
    }

    if (f.type === "checkbox") {
      payload[f.key] = Boolean(raw);
      continue;
    }

    const text = String(raw ?? "").trim();
    payload[f.key] = text ? text : undefined;
  }

  return payload;
}

async function save() {
  loading.value = true;
  error.value = "";
  try {
    const payload = buildPayload();
    if (editingId.value) {
      await apiAdminPut(`${props.resource}/${editingId.value}`, props.token, payload);
    } else {
      await apiAdminPost(props.resource, props.token, payload);
    }
    await refresh();
    cancelEdit();
  } catch (e: any) {
    error.value = String(e?.message ?? e);
  } finally {
    loading.value = false;
  }
}

async function remove(it: any) {
  const id = Number(it?.id);
  if (!Number.isFinite(id)) return;
  const ok = confirm(locale.value === "zh" ? `确认删除 #${id}？` : `Delete #${id}?`);
  if (!ok) return;

  loading.value = true;
  error.value = "";
  try {
    await apiAdminDelete(`${props.resource}/${id}`, props.token);
    await refresh();
  } catch (e: any) {
    error.value = String(e?.message ?? e);
  } finally {
    loading.value = false;
  }
}

function previewValue(it: any, f: FieldDef) {
  const v = it?.[f.key];
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return "[obj]";
  return String(v);
}
</script>

<style scoped>
th,
td {
  vertical-align: top;
}
</style>
