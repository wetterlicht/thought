<template>
    <TextElement ref="textElement" :id="`${id}-text`" contenteditable component="p" :blockId="id" :content="content"
        @updateContent="onUpdateContent" @replaceBlock="emit('replaceBlock', $event)" @newBlock="emit('newBlock')"
        @focusPrevious="emit('focusPrevious', id)" @focusNext="emit('focusNext', id)"
        @deleteBlock="emit('deleteBlock', id)">
    </TextElement>
</template>

<script setup lang="ts">
import { type PropType, type Ref, ref } from 'vue';
import { useRepo } from '@/composables/useRepo';
import TextElement from '../TextElement.vue';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    data: {
        type: Object as PropType<{ content: string }>,
        required: true
    },
})

const content = ref(props.data.content);
const textElement = ref();

const { updateBlockData } = useRepo();

const emit = defineEmits(['replaceBlock', 'newBlock', 'focusPrevious', 'focusNext', 'deleteBlock']);

function focusBlock(focusStart: boolean) {
    if (textElement.value === null) {
        return;
    }
    const editable = textElement.value.$el as HTMLElement;
    editable.focus();

    const range = document.createRange();
    range.selectNodeContents(editable);
    range.collapse(focusStart);

    const sel = window.getSelection();
    if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

defineExpose({ focusBlock })

const onUpdateContent = (content: string) => {
    updateBlockData(
        props.id,
        {
            ...props.data,
            content
        })
}
</script>

<style scoped></style>