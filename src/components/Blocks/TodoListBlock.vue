<template>
    <li class="flex gap-x-2">
        <input type="checkbox" :id="checkboxId" :checked="data.checked" @change="onCheckboxChange" />
        <TextElement ref="textElement" :blockId="id" :content="content" contenteditable @updateContent="onUpdateContent"
            @insertBlockAfter="emit('insertBlockAfter', $event)" @replaceBlock="emit('replaceBlock', $event)"
            @newBlock="emit('newBlock')" @focusBlock="emit('focusBlock')" @focusPrevious="emit('focusPrevious')"
            @focusNext="emit('focusNext')" @deleteBlock="emit('deleteBlock')">
        </TextElement>
    </li>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import TextElement from '../TextElement.vue';
import { computed, ref, type PropType } from 'vue'
import { useBlockEvents } from '@/composables/useBlockEvents';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    data: {
        type: Object as PropType<{ content: string, checked: boolean }>,
        required: true
    },
})

const content = ref(props.data.content);
const textElement = ref();
const checkboxId = computed(() => `checkbox-${props.id}`);

const { updateBlockData } = useRepo();

const emit = defineEmits(useBlockEvents().events);

const onCheckboxChange = (event: Event) => {
    const element = (event.target as HTMLInputElement);
    updateBlockData(
        props.id,
        {
            ...props.data,
            checked: element.checked
        })
}

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
[contentEditable=true] {
    width: 100%;

    &:focus {
        outline: none;
    }
}

li {
    line-height: 1.5rem;
}

input[type="checkbox"] {
    margin-top: 3px;
    width: 1.125rem;
    height: 1.125rem;
    accent-color: rgb(84, 148, 84);

    &:checked+div {
        text-decoration: line-through;
        color: oklch(55.3% 0.013 58.071)
    }
}
</style>