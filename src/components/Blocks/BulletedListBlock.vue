<template>
    <li class="flex gap-x-2">
        <div class="rounded-full bg-black size-1.5 mt-[0.5625rem] ml-1"></div>
        <TextElement ref="textElement" :blockId="id" :content="content" @updateContent="onUpdateContent"
            @insertBlockAfter="emit('insertBlockAfter', $event)" @replaceBlock="emit('replaceBlock', $event)"
            @newBlock="emit('newBlock')" @focusBlock="emit('focusBlock')" @focusPrevious="emit('focusPrevious')"
            @focusNext="emit('focusNext')" @deleteBlock="emit('deleteBlock')">
        </TextElement>
    </li>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
import { useRepo } from '@/composables/useRepo';
import TextElement from '../TextElement.vue';
import { useBlockEvents } from '@/composables/useBlockEvents';

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

const emit = defineEmits(useBlockEvents().events);

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