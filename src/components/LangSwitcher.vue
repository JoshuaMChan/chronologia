<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { locales } from '../i18n'

const { locale } = useI18n()

const selected = computed({
  get: () => locale.value,
  set: (code) => {
    locale.value = code
  },
})
</script>

<template>
  <div class="lang-switcher">
    <select v-model="selected" class="lang-select" aria-label="Language">
      <option v-for="loc in locales" :key="loc.code" :value="loc.code">
        {{ loc.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.lang-switcher {
  position: relative;
}

.lang-select {
  appearance: none;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237a6f62' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
}

.lang-select:hover {
  border-color: var(--accent);
}

.lang-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(124, 74, 46, 0.15);
}
</style>
