<template>
    <div class="blocks">
        <div class="px-[3px] py-[2px]" v-for="(block, index) in blocks" :key="block.id">
            <component :id="block.id" :ref="(el: FocusableBlock) => { blockRefs[block.id] = el }" :is="block.component"
                :data="block.data" @blockSelected="(name: string) => onBlockSelected(name, index)"
                @newBlock="() => onNewBlock(index)" @focusPrevious="onFocusPrevious" @focusNext="onFocusNext"
                @deleteBlock="() => onDeleteBlock(index)">
            </component>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import type { FocusableBlock } from '@/types';
import { computed, nextTick, ref, type Ref } from 'vue';

const props = defineProps({
    blockListId: {
        type: String,
        required: true
    }
});
const { deleteBlockAtIndex, insertBlockAtIndex, replaceBlockAtIndex, blocksByListId } = useRepo();

const blockRefs: Ref<Record<string, FocusableBlock>> = ref({});
const blocks = computed(() => blocksByListId.value(props.blockListId));

const onBlockSelected = (type: string, index: number) => {
    replaceBlockAtIndex(props.blockListId, type, index);
}

const onNewBlock = (beforeIndex: number) => {
    insertBlock("Text", beforeIndex);
}

const insertBlock = (type: string, beforeIndex: number) => {
    console.log("Inserting block of type: ", type, " at index: ", beforeIndex);
    const blockId = insertBlockAtIndex(props.blockListId, type, beforeIndex + 1);
    nextTick(() => {
        focusBlock(blockId, true)
    })
}

const onDeleteBlock = (index: number) => {
    deleteBlockAtIndex(props.blockListId, index);
    if (index > 0) {
        const id = blocks.value[index - 1].id
        focusBlock(id, false)
    }
}

function focusBlock(id: string, focusStart: boolean) {
    blockRefs.value[id].focusBlock(focusStart);
}

const onFocusPrevious = (id: string) => {
    const currentIndex = blocks.value.findIndex(block => block.id === id);
    if (currentIndex > 0) {
        const id = blocks.value[currentIndex - 1].id
        focusBlock(id, false)
    }
}

const onFocusNext = (id: string) => {
    const currentIndex = blocks.value.findIndex(block => block.id === id);
    if (currentIndex < blocks.value.length - 1) {
        const id = blocks.value[currentIndex + 1].id
        focusBlock(id, true)
    }
}

</script>

<style scoped></style>