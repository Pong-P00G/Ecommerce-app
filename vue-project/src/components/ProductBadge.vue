<script setup>
/**
 * ProductBadge — reusable product badge with source indicator and tooltip.
 *
 * Props:
 *   label   — badge text (e.g. "Coming Soon", "New Arrival")
 *   variant — CSS badge variant class suffix (ink | info | success | warning | danger)
 *   source  — 'tag' | 'heuristic' | null  — shows Tag or Sparkles icon
 *   tooltip — detailed tooltip text shown on hover
 *   compact — if true, uses smaller text/icons for list views
 */
import { computed } from 'vue';
import { Tag, Sparkles } from 'lucide-vue-next';
import BadgeTooltip from './BadgeTooltip.vue';

const props = defineProps({
    label: { type: String, default: '' },
    variant: { type: String, default: 'ink' },
    source: { type: String, default: null },
    tooltip: { type: String, default: '' },
    compact: { type: Boolean, default: false },
});

const iconSize = computed(() => props.compact ? 'w-2.5 h-2.5' : 'w-3 h-3');
const gapClass = computed(() => props.compact ? 'gap-1' : 'gap-1.5');
const textClass = computed(() => props.compact ? 'text-[10px]' : '');
</script>

<template>
    <BadgeTooltip
        v-if="label"
        :text="tooltip"
    >
        <span
            :class="[
                'inline-flex items-center',
                gapClass,
                textClass,
                'badge-' + variant,
            ]"
        >
            <Tag
                v-if="source === 'tag'"
                :class="iconSize"
                class="shrink-0 opacity-80"
            />
            <Sparkles
                v-else-if="source === 'heuristic'"
                :class="iconSize"
                class="shrink-0 opacity-80"
            />
            {{ label }}
        </span>
    </BadgeTooltip>
</template>
