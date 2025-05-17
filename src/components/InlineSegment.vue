<template>
    <span :class="segment.format?.join(' ')">
        {{ segment.text }}
    </span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Segment } from '@/types';

defineProps({
    segment: {
        type: Object as PropType<Segment>,
        required: true
    }
})

defineExpose({
    getJSON
})

function getJSON() {

}
</script>

<style scoped>
span.bold {
    font-weight: bold;
}

span.italic {
    font-style: italic;
}
</style>