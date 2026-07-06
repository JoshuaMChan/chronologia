<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LangSwitcher from './components/LangSwitcher.vue'
import TimelineLanes from './components/TimelineLanes.vue'
import PolityTable from './components/PolityTable.vue'
import anatolia from './data/regions/anatolia.json'
import {
  formatYear,
  getActivePolities,
  getFocusYearForPolity,
  localized,
} from './utils/timeline'

const { locale, t } = useI18n()

const region = anatolia
const currentYear = ref(-120)

const activePolities = computed(() =>
  getActivePolities(region.polities, currentYear.value)
)

const regionName = computed(() => localized(region.name, locale.value))

function selectYear(year) {
  currentYear.value = Math.max(
    region.range.start,
    Math.min(region.range.end, year)
  )
}

function focusPolity(polity) {
  selectYear(getFocusYearForPolity(polity, currentYear.value))
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="site-title">{{ t('site.title') }}</h1>
      <LangSwitcher />
    </header>

    <main class="main">
      <section class="region-header">
        <h2 class="region-name">{{ regionName }}</h2>
        <p class="year-display">
          <span class="year-label">{{ t('timeline.year') }}</span>
          <span class="year-value">{{ formatYear(currentYear, locale) }}</span>
        </p>
      </section>

      <section class="timeline-section">
        <TimelineLanes
          :polities="region.polities"
          :range="region.range"
          :current-year="currentYear"
          @select-year="selectYear"
        />
      </section>

      <PolityTable
        :polities="activePolities"
        :year="currentYear"
        @focus-polity="focusPolity"
      />
    </main>

    <footer class="footer">
      <span>Chronologia v0.2</span>
      <span class="footer-sep">·</span>
      <span>{{ regionName }}</span>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.site-title {
  font-family: var(--font-serif);
  font-size: 1.65rem;
  font-weight: 600;
  color: var(--accent);
  margin: 0;
  letter-spacing: 0.02em;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 1.5rem;
}

.region-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.region-name {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.year-display {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.year-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.year-value {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent);
}

.timeline-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem 0.85rem 0.75rem;
  margin-bottom: 0;
  overflow-x: auto;
}

.footer {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.footer-sep {
  opacity: 0.4;
}
</style>
