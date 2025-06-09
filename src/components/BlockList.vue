<template>
    <div class="blocks grid gap-y-2">
        <Block v-for="(block, index) in blocks" :ref="(el) => {
            if (!blockRefs) {
                blockRefs = {};
            }
            if (el) {
                blockRefs[block.id] = el as unknown as FocusableBlock;
            } else {
                delete blockRefs[block.id];
            }
        }" :block="block" :key="block.id" :data-block-id="block.id" @deleteBlock="onDeleteBlock(index)"
            @insertBlockAfter="(type) => onInsertBlockAfter(block.id, type)"
            @replaceBlock="(type) => onReplaceBlock(block.id, type)" @newBlock="onNewBlock(index)"
            @focusBlock="focusBlock(block.id, true)" @focusPrevious="onFocusPrevious(block.id)"
            @focusNext="onFocusNext(block.id)" class="relative flex gap-1">
        </Block>
    </div>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import type { FocusableBlock } from '@/types';
import { computed, nextTick, ref, type Ref } from 'vue';
import Block from './Block.vue';
import router from '@/router';
import type { AutomergeUrl } from '@automerge/automerge-repo';

const { replaceBlock, deleteBlockAtIndex, insertBlockAtIndex, getPageLink, blocksByListId, blockById } = useRepo();
const props = defineProps({
    blockListId: {
        type: String,
        required: true
    },
});
const emit = defineEmits(['empty', 'focusPrevious', 'focusNext']);
const blockRefs: Ref<Record<string, FocusableBlock>> = ref({});
const blocks = computed(() => blocksByListId.value(props.blockListId));

const getBlockListIndex = (id: string) => {
    return blocks.value.findIndex(b => b.id === id);
}

const onInsertBlockAfter = (blockId: string, type: string) => {
    const newBlockId = insertBlock(type, getBlockListIndex(blockId));
    handleNewBlock(newBlockId, type);
}

const onReplaceBlock = (blockId: string, type: string) => {
    const newBlockId = replaceBlock(props.blockListId, blockId, type);
    handleNewBlock(newBlockId, type);
}

const onNewBlock = (beforeIndex: number) => {
    const beforeBlock = blocks.value[beforeIndex];
    const type = ['Numbered list', 'Bulleted list', 'Todo list'].includes(beforeBlock.type)
        ? beforeBlock.type
        : "Text";
    const newBlockId = insertBlock(type, beforeIndex);
    handleNewBlock(newBlockId, type);
}

const insertBlock = (type: string, beforeIndex: number): string => {
    return insertBlockAtIndex(props.blockListId, type, beforeIndex + 1);
}

const handleNewBlock = (blockId: string, type: string) => {
    if (type === 'Page') {
        const block = blockById.value(blockId);
        router.push(getPageLink(block.data.pageId as AutomergeUrl));
    } else {
        nextTick(() => {
            focusBlock(blockId, true)
        })
    }
}

const onDeleteBlock = (index: number) => {
    deleteBlockAtIndex(props.blockListId, index);
    if (index > 0) {
        const id = blocks.value[index - 1].id
        focusBlock(id, false)
    } else {
        emit('focusPrevious');
    }
    if (blocks.value.length === 0) {
        emit('empty');
    }
}

function focusBlock(id: string, focusStart: boolean) {
    blockRefs.value[id].focusBlock(focusStart);
}

function focusBlockAtIndex(index: number, focusStart: boolean) {
    if (index >= 0 && index < blocks.value.length) {
        const id = blocks.value[index].id;
        focusBlock(id, focusStart);
    }
}

const focusFirstBlock = () => {
    if (blocks.value.length > 0) {
        focusBlockAtIndex(0, true);
    }
}

const focusLastBlock = () => {
    if (blocks.value.length > 0) {
        focusBlockAtIndex(blocks.value.length - 1, false);
    }
}

defineExpose({ focusFirstBlock, focusLastBlock });

const onFocusPrevious = (id: string) => {
    const currentIndex = blocks.value.findIndex(block => block.id === id);
    if (currentIndex > 0) {
        const id = blocks.value[currentIndex - 1].id
        focusBlock(id, false)
    } else {
        emit('focusPrevious');
    }
}

const onFocusNext = (id: string) => {
    const currentIndex = blocks.value.findIndex(block => block.id === id);
    if (currentIndex < blocks.value.length - 1) {
        const id = blocks.value[currentIndex + 1].id
        focusBlock(id, true)
    } else {
        emit('focusNext');
    }
}
</script>

<style scoped></style>