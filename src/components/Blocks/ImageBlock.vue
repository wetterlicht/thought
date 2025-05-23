<template>
    <div v-if="block" class="image-block" @keydown="onKeydown" tabindex="0">
        <figure v-if="src && caption">
            <img class="image-block__image" :src="src" :alt="alt" />
            <figcaption v-if="caption">{{ caption }}</figcaption>
        </figure>
        <img class="image-block__image" v-else-if="src" :src="src" :alt="alt" />
        <button v-else class="image-block__add-button" @click="onAddImage">Add an image</button>
    </div>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import { type Ref, ref } from 'vue';

const props = defineProps({
    id: {
        type: String,
        required: true
    }
})

const { blockById, updateBlockData, createAsset } = useRepo();
const block = blockById.value(props.id);

const assetId = ref();
const alt = ref();
const caption = ref();

const emit = defineEmits(['blockSelected', 'newBlock', 'focusPrevious', 'focusNext', 'deleteBlock', 'updateBlock']);

const addImageButton: Ref<HTMLElement | null> = ref(null)

function focusBlock(_focusStart: boolean) {
    if (addImageButton.value) {
        addImageButton.value.focus()
    }
}

defineExpose({ focusBlock })

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        emit('newBlock')
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        emit('deleteBlock')
    }
}

const onAddImage = async () => {
    // assetId.value = createAsset();
    // save();
}

const save = () => {
    const data = {
        assetId: assetId.value,
        alt: alt.value,
        caption: caption.value,
    };

    updateBlockData(block.id, data);
}
</script>

<style scoped>
button.image-block__add-button {
    width: 100%;
    border-radius: 4px;
    border: none;
    background-color: #eee;
    padding-inline: 1rem;
    padding-block: 1rem;
    text-align: left;
    cursor: pointer;
}

.image-block__image {
    max-width: 100%;
}
</style>