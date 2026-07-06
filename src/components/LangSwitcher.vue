<script setup>
import { useI18n } from 'vue-i18n'
import { locales } from '../i18n'

const { locale } = useI18n()
</script>

<template>
  <div class="lang-switcher">
    <button
      v-for="loc in locales"
      :key="loc.code"
      class="lang-btn"
      :class="{ active: locale === loc.code }"
      @click="locale = loc.code"
    >
      {{ loc.label }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 0.25rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.2rem;
}

.lang-btn {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.lang-btn:hover {
  color: var(--text);
  background: var(--surface-3);
}

.lang-btn.active {
  color: var(--accent);
  background: var(--surface);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
</style>
