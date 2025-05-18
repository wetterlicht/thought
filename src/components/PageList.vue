<template>
    <ul class="w-full flex flex-col gap-y-px">
        <PageListElement v-for="page in pages" :key="page.id" :workspaceId="workspaceId" :page="page" :depth="depth">
        </PageListElement>
    </ul>
</template>

<script setup lang="ts">
import type { AssembledPage } from '@/types';
import PageListElement from './PageListElement.vue';

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
    pages: {
        type: Array<AssembledPage>,
        required: true
    },
    depth: {
        type: Number,
        default: 0
    }
})
</script>

<style scoped></style>