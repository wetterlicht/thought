<template>
    <li class="flex">
        <TextElement ref="textElement" :blockId="id" :content="content" @updateContent="onUpdateContent"
            @insertBlockAfter="emit('insertBlockAfter', $event)" @replaceBlock="emit('replaceBlock', $event)"
            @newBlock="emit('newBlock')" @focusBlock="emit('focusBlock')" @focusPrevious="emit('focusPrevious')"
            @focusNext="emit('focusNext')" @deleteBlock="emit('deleteBlock')">
        </TextElement>
    </li>
</template>

<script setup lang="ts">
import { type PropType, type Ref, ref } from 'vue';
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
const textElement = ref();

const { updateBlockData } = useRepo();

const emit = defineEmits(useBlockEvents().events);

const editable: Ref<HTMLElement | null> = ref(null)

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