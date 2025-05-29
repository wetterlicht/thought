<template>
    <div>
        <div class="p-4 rounded bg-stone-200 grid grid-cols-[auto_1fr] gap-2">
            <div>
                <button class="w-fit hover:bg-stone-100 rounded aspect-square ">{{
                    '🫎'
                }}</button>
            </div>
            <BlockList ref="blockList" :blockListId="data.blockListId">
            </BlockList>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import BlockList from '../BlockList.vue';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    data: {
        type: Object as PropType<{ icon: string, blockListId: string }>,
        required: true
    },
})
</script>

<style scoped></style>