<template>
    <TextElement :component="tag" :blockId="id" :content="content" @updateContent="onUpdateContent"
        @replaceBlock="emit('replaceBlock', $event)" @newBlock="emit('newBlock')"
        @focusPrevious="emit('focusPrevious', id)" @focusNext="emit('focusNext', id)"
        @deleteBlock="emit('deleteBlock', id)" ref="textElement" contenteditable>
    </TextElement>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import { computed, type PropType, ref } from 'vue';
import TextElement from '../TextElement.vue';

const props = defineProps({
    id: { type: String, required: true },
    data: {
        type: Object as PropType<{ content: string, level: number }>,
        required: true
    },
})

const { updateBlockData } = useRepo();
const content = ref(props.data.content);
const textElement = ref()

const tag = computed(() => {
    return "h" + (props.data.level + 1)
})

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

<style scoped>
h2,
h3,
h4,
h5,
h6 {
    margin: 0;
}

[contentEditable=true] {
    width: 100%;

    &:focus {
        outline: none;
    }
}

[contentEditable=true]:focus:empty:before,
[contentEditable=true]:only-child:empty:before {
    content: attr(placeholder);
    opacity: 0.6;
}
</style>