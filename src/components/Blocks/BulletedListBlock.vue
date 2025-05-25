<template>
    <li class="flex gap-x-2">
        <div class="rounded-full bg-black size-1.5 mt-[0.5625rem] ml-1"></div>
        <TextElement ref="textElement" :blockId="id" :content="content" @updateContent="onUpdateContent"
            @replaceBlock="emit('replaceBlock', $event)" @newBlock="emit('newBlock')"
            @focusPrevious="emit('focusPrevious', id)" @focusNext="emit('focusNext', id)"
            @deleteBlock="emit('deleteBlock', id)" contenteditable>
        </TextElement>
    </li>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
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

const { updateBlockData } = useRepo();

const emit = defineEmits(['replaceBlock', 'newBlock', 'focusPrevious', 'focusNext', 'deleteBlock']);

const textElement = ref();

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