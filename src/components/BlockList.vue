<template>
    <div class="blocks">
        <component v-for="(group, groupIndex) in blockGroups" :key="groupIndex"
            :is="getWrapperComponent(group[0].type)">
            <component v-for="block in group" :key="block.id" :id="block.id" class="px-[3px] py-[2px]"
                :ref="(el: FocusableBlock) => { blockRefs[block.id] = el }" :is="block.component" :data="block.data"
                @blockSelected="(name: string) => onBlockSelected(name, getBlockListIndex(block.id))"
                @newBlock="() => onNewBlock(getBlockListIndex(block.id))" @focusPrevious="onFocusPrevious"
                @focusNext="onFocusNext" @deleteBlock="() => onDeleteBlock(getBlockListIndex(block.id))">
            </component>
        </component>
    </div>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import type { BlockWithComponent, FocusableBlock } from '@/types';
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

const onBlockSelected = (type: string, index: number) => {
    const id = replaceBlockAtIndex(props.blockListId, type, index);
    nextTick(() => {
        focusBlock(id, false)
    })
}

const onNewBlock = (beforeIndex: number) => {
    const beforeBlock = blocks.value[beforeIndex];
    const type = ['Numbered list', 'Bulleted list', 'Todo list'].includes(beforeBlock.type)
        ? beforeBlock.type
        : "Text";
    insertBlock(type, beforeIndex);
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