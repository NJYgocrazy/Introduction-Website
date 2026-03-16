<template>
  <div class="card rounded-xl overflow-hidden w-full">
    <div class="flex flex-col md:flex-row">
      <div class="p-8 flex-1 min-w-0"
        style="background: linear-gradient(135deg, rgba(15,58,120,0.18), rgba(15,23,42,0.08))">
        <div class="nameText text-lg font-semibold leading-snug">
          {{ nameText }}
        </div>
        <div class="text-sm mt-2 leading-7" style="color: rgb(var(--c-muted))">
          {{ descText }}
        </div>
      </div>

      <!-- <div class="md:w-72 md:border-l" style="border-color: rgb(var(--c-border))">
        <div class="h-48 md:h-full bg-center bg-cover rounded-br-xl" :style="{
          backgroundImage: imageStyle
        }" role="img" :aria-label="nameText" />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { pickText } from "../lib/fields";

type ResearchArea = {
  id: number;
  nameZh: string;
  nameEn: string;
  descZh?: string | null;
  descEn?: string | null;
  imageUrl?: string | null;
};

const props = defineProps<{
  row: ResearchArea;
}>();

const nameText = computed(() => pickText(props.row, "name"));
const descText = computed(() => pickText(props.row, "desc"));

const imageStyle = computed(() => {
  const url = props.row.imageUrl ? String(props.row.imageUrl) : "";
  if (url) return `url(${url})`;
  return "linear-gradient(135deg, rgba(15,58,120,0.18), rgba(15,23,42,0.08))";
});
</script>

<style scoped>
.nameText {
  color: #743481;
}
</style>