<template>
  <header class="sticky top-0 z-50 border-b" style="background: rgba(255,255,255,0.97); border-color: rgb(var(--c-border));border-bottom: none">
    <div class="mx-auto max-w-7xl px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
      <RouterLink class="titleWeb" to="/">HaiSolar</RouterLink>
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

.titleWeb {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--c-ink));
  text-decoration: none;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 160ms ease;
  padding: 8px 12px;
  border-radius: 6px;
}

.titleWeb:hover {
  opacity: 0.85;
  background: rgba(0, 0, 0, 0.03);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .titleWeb {
    font-size: 1.3rem;
  }
}
</style>
