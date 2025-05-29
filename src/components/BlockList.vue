<template>
    <div class="blocks">
        <component v-for="(group, groupIndex) in blockGroups" :key="groupIndex"
            :is="getWrapperComponent(group[0].type)">
            <component v-for="block in group" :key="block.id" class="px-[3px] py-[2px]"
                :ref="(el: FocusableBlock) => { blockRefs[block.id] = el }" :is="block.component" :id="block.id"
                :data="block.data" @replaceBlock="(type: string) => onReplaceBlock(block.id, type)"
                @insertBlockAfter="(type: string) => onInsertBlockAfter(block.id, type)"
                @newBlock="() => onNewBlock(getBlockListIndex(block.id))"
                @focusPrevious="() => onFocusPrevious(block.id)" @focusBlock="focusBlock(block.id, true)"
                @focusNext="() => onFocusNext(block.id)" @deleteBlock="() => onDeleteBlock(getBlockListIndex(block.id))"
                @click="focusBlock(block.id, true)">
            </component>
        </component>
    </div>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import type { BlockWithComponent, FocusableBlock } from '@/types';
import { computed, nextTick, ref, type Ref } from 'vue';

const { replaceBlock, deleteBlockAtIndex, insertBlockAtIndex, blocksByListId } = useRepo();
const props = defineProps({
    blockListId: {
        type: String,
        required: true
    }
});
const emit = defineEmits(['empty', 'focusPrevious', 'focusNext']);

const blockRefs: Ref<Record<string, FocusableBlock>> = ref({});
const blocks = computed(() => blocksByListId.value(props.blockListId));

const blockGroups = computed(() => {
    const groups = [];
    let currentGroup: BlockWithComponent[] = [];
    blocks.value.forEach((block, i) => {
        if (
            currentGroup.length === 0 ||
            currentGroup[0].type === block.type
        ) {
            currentGroup.push(block);
        } else {
            groups.push(currentGroup);
            currentGroup = [block];
        }
    });
    if (currentGroup.length) {
        groups.push(currentGroup);
    }
    return groups;
});

const getBlockListIndex = (id: string) => {
    return blocks.value.findIndex(b => b.id === id);
}

const getWrapperComponent = (type: string) => {
    switch (type) {
        case "Numbered list":
            return "ol";
        case "Bulleted list":
        case "Todo list":
            return "ul";
        default:
            return "div";
    }
}

const onInsertBlockAfter = (blockId: string, type: string) => {
    insertBlock(type, getBlockListIndex(blockId));
}

const onReplaceBlock = (blockId: string, type: string) => {
    const newBlockId = replaceBlock(props.blockListId, blockId, type);
    nextTick(() => {
        focusBlock(newBlockId, true);
    });
}

const onNewBlock = (beforeIndex: number) => {
    const beforeBlock = blocks.value[beforeIndex];
    const type = ['Numbered list', 'Bulleted list', 'Todo list'].includes(beforeBlock.type)
        ? beforeBlock.type
        : "Text";
    insertBlock(type, beforeIndex);
}

const insertBlock = (type: string, beforeIndex: number) => {
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