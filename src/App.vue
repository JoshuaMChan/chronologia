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
  percentToYear,
  yearToPercent,
} from './utils/timeline'

const { locale, t } = useI18n()

const region = anatolia
const currentYear = ref(-120)

const sliderPercent = computed({
  get: () => yearToPercent(currentYear.value, region.range.start, region.range.end),
  set: (val) => {
    currentYear.value = percentToYear(val, region.range.start, region.range.end)
  },
})

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
      <div class="header-text">
        <h1 class="site-title">{{ t('site.title') }}</h1>
        <p class="site-subtitle">{{ t('site.subtitle') }}</p>
      </div>
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

        <input
          v-model.number="sliderPercent"
          type="range"
          class="year-slider"
          min="0"
          max="100"
          step="0.1"
        />
        <p class="hint">{{ t('timeline.dragHint') }}</p>
      </section>

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
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.site-title {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--accent);
  margin: 0;
  letter-spacing: 0.02em;
}

.site-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.region-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.region-name {
  font-family: var(--font-serif);
  font-size: 1.75rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.year-value {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent);
}

.timeline-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem 1rem 1rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.year-slider {
  width: 100%;
  margin-top: 1rem;
  accent-color: var(--accent);
  cursor: pointer;
}

.hint {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0.75rem 0 0;
}

.active-section {
  margin-bottom: 1.5rem;
}

.active-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border: 1.5px solid;
  border-radius: 999px;
  background: var(--surface);
}

.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin: 0 0 0.75rem;
}

.cards-section {
  margin-bottom: 2rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.empty-state {
  color: var(--text-muted);
  font-style: italic;
}

.footer {
  padding: 1.25rem 2rem;
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
