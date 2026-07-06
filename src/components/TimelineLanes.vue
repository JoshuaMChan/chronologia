<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  axisTicks,
  barStyle,
  formatAxisYear,
  isPolityActive,
  localized,
  rulerSegmentStyle,
  yearToPercent,
} from '../utils/timeline'

const props = defineProps({
  polities: { type: Array, required: true },
  range: { type: Object, required: true },
  currentYear: { type: Number, required: true },
})

const emit = defineEmits(['select-year'])

const { locale } = useI18n()

const ticks = computed(() => axisTicks(props.range))

const playheadLeft = computed(() =>
  yearToPercent(props.currentYear, props.range.start, props.range.end)
)

function onTrackClick(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const percent = ((e.clientX - rect.left) / rect.width) * 100
  const year = Math.round(
    props.range.start + (percent / 100) * (props.range.end - props.range.start)
  )
  emit('select-year', year)
}

function onLaneClick(polity, e) {
  e.stopPropagation()
  const mid = Math.round((polity.start + polity.end) / 2)
  emit('select-year', mid)
}

function laneTooltip(polity) {
  const parts = []
  if (polity.ethnicity) parts.push(localized(polity.ethnicity, locale.value))
  if (polity.culture) parts.push(localized(polity.culture, locale.value))
  return parts.join(' · ')
}
</script>

<template>
  <div class="timeline-lanes">
    <div class="time-header">
      <div class="label-col" />
      <div class="track-col">
        <div class="tick-row">
          <span
            v-for="year in ticks"
            :key="year"
            class="tick"
            :style="{ left: `${yearToPercent(year, range.start, range.end)}%` }"
          >
            {{ formatAxisYear(year) }}
          </span>
        </div>
      </div>
    </div>

    <div class="lanes-body">
      <div class="track-col track-grid">
        <div class="grid-lines">
          <div
            v-for="year in ticks"
            :key="`grid-${year}`"
            class="grid-line"
            :style="{ left: `${yearToPercent(year, range.start, range.end)}%` }"
          />
        </div>
        <div class="playhead" :style="{ left: `${playheadLeft}%` }" />
      </div>

      <div
        v-for="polity in polities"
        :key="polity.id"
        class="lane"
        :class="{ active: isPolityActive(polity, currentYear) }"
      >
        <button
          type="button"
          class="label-col lane-label"
          :style="{ borderLeftColor: polity.color }"
          :title="laneTooltip(polity)"
          @click="onLaneClick(polity, $event)"
        >
          {{ localized(polity.name, locale) }}
        </button>
        <div class="track-col lane-track" @click="onTrackClick">
          <div
            class="polity-bar"
            :class="{ active: isPolityActive(polity, currentYear) }"
            :style="barStyle(polity, range)"
            :title="localized(polity.name, locale)"
          />
          <div
            v-for="ruler in polity.rulers"
            :key="ruler.id"
            class="ruler-marker"
            :style="{ ...rulerSegmentStyle(ruler, range), borderColor: polity.color }"
            :title="localized(ruler.name, locale)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-lanes {
  --label-width: 11rem;
  font-variant-numeric: tabular-nums;
}

.time-header,
.lane {
  display: grid;
  grid-template-columns: var(--label-width) 1fr;
  align-items: center;
}

.lanes-body {
  position: relative;
}

.label-col {
  flex-shrink: 0;
}

.track-col {
  position: relative;
  min-width: 0;
}

.tick-row {
  position: relative;
  height: 1.25rem;
  margin-bottom: 0.5rem;
}

.tick {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.track-grid {
  position: absolute;
  top: 0;
  right: 0;
  left: var(--label-width);
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-lines {
  position: absolute;
  inset: 0;
}

.grid-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border);
  opacity: 0.6;
  transform: translateX(-50%);
}

.playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent);
  transform: translateX(-50%);
  z-index: 20;
  pointer-events: none;
}

.playhead::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: var(--accent);
  border: 2px solid var(--surface);
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.lane {
  position: relative;
  z-index: 1;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s ease;
}

.lane:last-child {
  border-bottom: none;
}

.lane.active {
  background: rgba(124, 74, 46, 0.04);
}

.lane-label {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.65rem 0.75rem 0.65rem 0.6rem;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--text);
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: color 0.15s ease;
}

.lane.active .lane-label {
  font-weight: 600;
  color: var(--accent);
}

.lane-label:hover {
  color: var(--accent);
}

.lane-track {
  position: relative;
  height: 36px;
  padding: 8px 0;
  cursor: crosshair;
}

.polity-bar {
  position: absolute;
  top: 10px;
  height: 16px;
  background: color-mix(in srgb, var(--bar-color) 55%, white);
  border: 1.5px solid var(--bar-color);
  border-radius: 3px;
  opacity: 0.75;
  transition: opacity 0.15s ease, box-shadow 0.15s ease;
}

.polity-bar.active {
  opacity: 1;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--bar-color) 25%, transparent);
  z-index: 2;
}

.ruler-marker {
  position: absolute;
  top: 6px;
  height: 24px;
  min-width: 4px;
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  border: 2px solid;
  border-radius: 3px;
  z-index: 3;
  pointer-events: none;
}

@media (max-width: 640px) {
  .timeline-lanes {
    --label-width: 7.5rem;
  }

  .lane-label {
    font-size: 0.7rem;
    padding-right: 0.4rem;
  }
}
</style>
