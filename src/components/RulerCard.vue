<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatYear, localized } from '../utils/timeline'

const props = defineProps({
  polity: { type: Object, required: true },
  ruler: { type: Object, default: null },
  isActive: { type: Boolean, default: false },
})

const { locale } = useI18n()

const polityName = computed(() => localized(props.polity.name, locale.value))
const rulerName = computed(() =>
  props.ruler ? localized(props.ruler.name, locale.value) : null
)
const reign = computed(() =>
  props.ruler
    ? `${formatYear(props.ruler.start, locale.value)} — ${formatYear(props.ruler.end, locale.value)}`
    : null
)
const rulerNote = computed(() =>
  props.ruler?.note ? localized(props.ruler.note, locale.value) : null
)
const contemporary = computed(() =>
  props.polity.contemporary
    ? localized(props.polity.contemporary, locale.value)
    : null
)
</script>

<template>
  <article class="ruler-card" :class="{ active: isActive }">
    <div class="color-bar" :style="{ background: polity.color }" />
    <div class="card-body">
      <p class="polity-label">{{ polityName }}</p>
      <template v-if="ruler">
        <h3 class="ruler-name">{{ rulerName }}</h3>
        <p class="reign">{{ $t('timeline.reign') }}: {{ reign }}</p>
        <p v-if="rulerNote" class="ruler-note">{{ rulerNote }}</p>
      </template>
      <p v-else class="no-ruler">{{ $t('timeline.noRuler') }}</p>
      <p v-if="contemporary" class="contemporary">
        <span class="tag">{{ $t('timeline.contemporary') }}</span>
        {{ contemporary }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.ruler-card {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ruler-card.active {
  border-color: var(--accent);
  box-shadow: 0 2px 12px rgba(124, 74, 46, 0.12);
}

.color-bar {
  width: 4px;
  flex-shrink: 0;
}

.card-body {
  padding: 1rem 1.15rem;
  flex: 1;
}

.polity-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 0 0 0.35rem;
}

.ruler-name {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.4rem;
  line-height: 1.2;
}

.reign {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.ruler-note {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0.35rem 0 0;
  line-height: 1.4;
}

.no-ruler {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
}

.contemporary {
  margin: 0.65rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.tag {
  display: inline-block;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
  margin-right: 0.4rem;
  color: var(--accent);
}
</style>
