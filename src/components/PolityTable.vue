<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  formatYear,
  getFocusYearForPolity,
  getPolityRulerAtYear,
  localized,
  localizedContemporary,
  localizedList,
} from '../utils/timeline'

const props = defineProps({
  polities: { type: Array, required: true },
  year: { type: Number, required: true },
})

const emit = defineEmits(['focus-polity'])

const { locale, t } = useI18n()

const yearLabel = computed(() => formatYear(props.year, locale.value))

function rulerFor(polity) {
  return getPolityRulerAtYear(polity, props.year)
}

function onPolityClick(polity) {
  emit('focus-polity', polity)
}
</script>

<template>
  <section class="polity-table-section">
    <h3 class="section-title">
      {{ t('timeline.activeAt', { year: yearLabel }) }}
    </h3>

    <div v-if="polities.length" class="table-wrap">
      <table class="polity-table">
        <thead>
          <tr>
            <th>{{ t('timeline.period') }}</th>
            <th>{{ t('timeline.ruler') }}</th>
            <th>{{ t('timeline.ethnicity') }}</th>
            <th>{{ t('timeline.writing') }}</th>
            <th>{{ t('timeline.culture') }}</th>
            <th>{{ t('timeline.religion') }}</th>
            <th>{{ t('timeline.contemporary') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="polity in polities"
            :key="polity.id"
            class="polity-row"
            @click="onPolityClick(polity)"
          >
            <td>
              <div class="col-polity">
                <span class="color-bar" :style="{ background: polity.color }" />
                <span class="polity-name">{{ localized(polity.name, locale) }}</span>
              </div>
            </td>
            <td class="col-ruler">
              <template v-if="rulerFor(polity)">
                {{ localized(rulerFor(polity).name, locale) }}
              </template>
              <span v-else class="muted">{{ t('timeline.noRuler') }}</span>
            </td>
            <td>{{ localized(polity.ethnicity, locale) }}</td>
            <td>{{ localizedList(polity.writing, locale) }}</td>
            <td>{{ localized(polity.culture, locale) }}</td>
            <td>{{ localizedList(polity.religion, locale) }}</td>
            <td>{{ localizedContemporary(polity.contemporary, locale) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="empty-state">{{ t('timeline.noPolity') }}</p>
  </section>
</template>

<style scoped>
.polity-table-section {
  margin-top: 0.75rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin: 0 0 0.5rem;
}

.table-wrap {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow-x: auto;
  background: var(--surface);
}

.polity-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.polity-table th,
.polity-table td {
  padding: 0.45rem 0.65rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--border);
  line-height: 1.35;
}

.polity-table th {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  background: var(--surface-2);
  white-space: nowrap;
}

.polity-table tbody tr:last-child td {
  border-bottom: none;
}

.polity-row {
  cursor: pointer;
  transition: background 0.12s ease;
}

.polity-row:hover {
  background: rgba(124, 74, 46, 0.04);
}

.col-polity {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  min-width: 7rem;
}

.color-bar {
  width: 3px;
  align-self: stretch;
  border-radius: 2px;
  flex-shrink: 0;
}

.col-ruler {
  white-space: nowrap;
  font-weight: 500;
}

.muted {
  color: var(--text-muted);
  font-style: italic;
  font-weight: 400;
}

.empty-state {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 720px) {
  .polity-table th,
  .polity-table td {
    padding: 0.4rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
