<template>
  <header class="sticky top-0 z-50 border-b" style="background: rgba(255,255,255,0.97); border-color: rgb(var(--c-border))">
    <div class="mx-auto max-w-7xl px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
      <nav class="hidden md:flex items-center justify-center gap-8 text-[1.08rem] font-medium flex-1">
        <RouterLink class="nav-link" to="/">Home</RouterLink>
        <RouterLink class="nav-link" to="/publications">Publications</RouterLink>
        <RouterLink class="nav-link" to="/people">People</RouterLink>
        <RouterLink class="nav-link" to="/awards">Awards</RouterLink>
        <RouterLink class="nav-link" to="/recruitment">Recruitment</RouterLink>
      </nav>
    </div>

    <div class="md:hidden border-t px-4 py-3 flex flex-wrap gap-3 text-sm" style="border-color: rgb(var(--c-border)); background: rgb(255 255 255)">
      <RouterLink class="nav-link" to="/">Home</RouterLink>
      <RouterLink class="nav-link" to="/publications">Publications</RouterLink>
      <RouterLink class="nav-link" to="/people">People</RouterLink>
      <RouterLink class="nav-link" to="/awards">Awards</RouterLink>
      <RouterLink class="nav-link" to="/recruitment">Recruitment</RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.nav-link {
  color: rgb(var(--c-muted));
  transition: color 160ms ease, opacity 160ms ease;
}

.nav-link:hover {
  color: rgb(var(--c-ink));
}

.router-link-active.nav-link {
  color: rgb(var(--c-ink));
  position: relative;
}

.router-link-active.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -14px;
  height: 3px;
  background: rgb(var(--c-accent));
  opacity: 0.95;
}
</style>
