<template>
    <TextElement :class="computedClasses" ref="textElement" :id="`${id}-text`" contenteditable component="p"
        :blockId="id" :content="content" @updateContent="onUpdateContent"
        @insertBlockAfter="emit('insertBlockAfter', $event)" @replaceBlock="emit('replaceBlock', $event)"
        @newBlock="emit('newBlock')" @focusBlock="emit('focusBlock')" @focusPrevious="emit('focusPrevious')"
        @focusNext="emit('focusNext')" @deleteBlock="emit('deleteBlock')">
    </TextElement>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import { useRepo } from '@/composables/useRepo';
import TextElement from '../TextElement.vue';
import { useBlockEvents } from '@/composables/useBlockEvents';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    data: {
        type: Object as PropType<{ content: string, textColor: string | null, backgroundColor: string | null }>,
        required: true
    },
})

const content = ref(props.data.content);
const textElement = ref();

const computedClasses = computed(() => {
    const classes: string[] = []
    if (props.data.textColor) {
        classes.push('text-' + props.data.textColor + '-600')
    }
    if (props.data.backgroundColor) {
        classes.push('bg-' + props.data.backgroundColor + '-100');
        classes.push('border-' + props.data.backgroundColor + '-100');
    }
    return classes;
})

const { updateBlockData } = useRepo();

const emit = defineEmits(useBlockEvents().events);

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