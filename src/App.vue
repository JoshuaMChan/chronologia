<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LangSwitcher from './components/LangSwitcher.vue'
import TimelineLanes from './components/TimelineLanes.vue'
import RulerCard from './components/RulerCard.vue'
import anatolia from './data/regions/anatolia.json'
import {
  formatYear,
  getActivePolities,
  getActiveRulers,
  localized,
} from './utils/timeline'

const { locale, t } = useI18n()

const region = anatolia
const currentYear = ref(-120)

const activePolities = computed(() =>
  getActivePolities(region.polities, currentYear.value)
)

const activeRulers = computed(() =>
  getActiveRulers(region.polities, currentYear.value)
)

const regionName = computed(() => localized(region.name, locale.value))

function selectYear(year) {
  currentYear.value = Math.max(
    region.range.start,
    Math.min(region.range.end, year)
  )
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

      <div class="detail-row" :class="{ parallel: activePolities.length }">
        <section v-if="activePolities.length" class="active-section">
          <h3 class="section-title">
            {{ t('timeline.activeAt', { year: formatYear(currentYear, locale) }) }}
          </h3>
          <div class="active-chips">
            <span
              v-for="polity in activePolities"
              :key="polity.id"
              class="chip"
              :style="{ borderColor: polity.color, color: polity.color }"
            >
              {{ localized(polity.name, locale) }}
            </span>
          </div>
        </section>

        <section class="cards-section">
          <h3 class="section-title">{{ t('timeline.ruler') }}</h3>
          <div v-if="activeRulers.length" class="cards-grid">
            <RulerCard
              v-for="{ polity, ruler } in activeRulers"
              :key="ruler.id"
              :polity="polity"
              :ruler="ruler"
              :is-active="true"
            />
          </div>
          <div v-else-if="activePolities.length" class="cards-grid">
            <RulerCard
              v-for="polity in activePolities"
              :key="polity.id"
              :polity="polity"
              :is-active="true"
            />
          </div>
          <p v-else class="empty-state">{{ t('timeline.noPolity') }}</p>
        </section>
      </div>
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
  padding: 1rem 0.85rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.detail-row.parallel {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 1.8fr;
  gap: 1rem;
  align-items: start;
}

.active-section {
  margin-bottom: 0;
}

.active-chips {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
}

.chip {
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border: 1.5px solid;
  border-radius: 999px;
  background: var(--surface);
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin: 0 0 0.5rem;
}

.cards-section {
  margin-bottom: 0;
  min-width: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (max-width: 720px) {
  .detail-row.parallel {
    grid-template-columns: 1fr;
  }

  .active-chips {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

.empty-state {
  color: var(--text-muted);
  font-style: italic;
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
