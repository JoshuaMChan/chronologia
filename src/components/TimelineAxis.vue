<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { localized, yearToPercent } from '../utils/timeline'

const props = defineProps({
  periods: { type: Array, required: true },
  range: { type: Object, required: true },
  currentYear: { type: Number, required: true },
})

const emit = defineEmits(['select-year'])

const { locale } = useI18n()

const axisLabels = computed(() => {
  const { start, end } = props.range
  const step = 500
  const labels = []
  const first = Math.ceil(start / step) * step
  for (let y = first; y <= end; y += step) {
    labels.push(y)
  }
  return labels
})

function periodStyle(period) {
  const left = yearToPercent(period.start, props.range.start, props.range.end)
  const right = yearToPercent(period.end, props.range.start, props.range.end)
  return {
    left: `${left}%`,
    width: `${right - left}%`,
    background: period.color,
  }
}

function rulerStyle(ruler, period) {
  const left = yearToPercent(ruler.start, props.range.start, props.range.end)
  const right = yearToPercent(ruler.end, props.range.start, props.range.end)
  return {
    left: `${left}%`,
    width: `${Math.max(right - left, 0.8)}%`,
    borderColor: period.color,
  }
}

function cursorStyle() {
  const left = yearToPercent(props.currentYear, props.range.start, props.range.end)
  return { left: `${left}%` }
}

function onTrackClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const percent = ((e.clientX - rect.left) / rect.width) * 100
  const year = Math.round(
    props.range.start + (percent / 100) * (props.range.end - props.range.start)
  )
  emit('select-year', year)
}

function formatAxisYear(year) {
  if (year < 0) return Math.abs(year)
  return year
}
</script>

<template>
  <div class="timeline-axis">
    <div class="axis-labels">
      <span
        v-for="year in axisLabels"
        :key="year"
        class="axis-label"
        :style="{ left: `${yearToPercent(year, range.start, range.end)}%` }"
      >
        {{ formatAxisYear(year) }}
      </span>
    </div>

    <div class="track-area" @click="onTrackClick">
      <div class="track-bg" />

      <div
        v-for="period in periods"
        :key="period.id"
        class="period-bar"
        :class="{ active: currentYear >= period.start && currentYear <= period.end }"
        :style="periodStyle(period)"
        :title="localized(period.name, locale)"
      />

      <template v-for="period in periods" :key="`rulers-${period.id}`">
        <div
          v-for="ruler in period.rulers"
          :key="ruler.id"
          class="ruler-marker"
          :style="rulerStyle(ruler, period)"
          :title="localized(ruler.name, locale)"
        />
      </template>

      <div class="cursor" :style="cursorStyle">
        <div class="cursor-line" />
        <div class="cursor-dot" />
      </div>
    </div>

    <div class="period-labels">
      <div
        v-for="period in periods"
        :key="`label-${period.id}`"
        class="period-label"
        :style="{ left: `${yearToPercent(period.start, range.start, range.end)}%` }"
      >
        {{ localized(period.name, locale) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-axis {
  position: relative;
  padding: 0.5rem 0 2.5rem;
}

.axis-labels {
  position: relative;
  height: 1.5rem;
  margin-bottom: 0.5rem;
}

.axis-label {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.track-area {
  position: relative;
  height: 72px;
  cursor: pointer;
}

.track-bg {
  position: absolute;
  inset: 24px 0;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.period-bar {
  position: absolute;
  top: 24px;
  height: 24px;
  opacity: 0.55;
  border-radius: 2px;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 1;
}

.period-bar.active {
  opacity: 0.9;
  transform: scaleY(1.15);
  z-index: 2;
}

.ruler-marker {
  position: absolute;
  top: 16px;
  height: 40px;
  border: 2px solid;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.85);
  z-index: 3;
  min-width: 3px;
}

.cursor {
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

.cursor-line {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 50%;
  width: 2px;
  background: var(--accent);
  transform: translateX(-50%);
}

.cursor-dot {
  position: absolute;
  top: 0;
  left: 50%;
  width: 12px;
  height: 12px;
  background: var(--accent);
  border: 2px solid var(--surface);
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.period-labels {
  position: relative;
  margin-top: 0.75rem;
  min-height: 2.5rem;
}

.period-label {
  position: absolute;
  font-size: 0.7rem;
  color: var(--text-muted);
  max-width: 120px;
  line-height: 1.3;
  transform: translateX(2px);
}
</style>
