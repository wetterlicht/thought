<template>
    <div>
        <div class="px-4 py-4 rounded grid grid-cols-[auto_1fr] border gap-1" :class="computedClasses">
            <div>
                <div v-if="data.icon">
                    <button class="border border-transparent hover:border-stone-600 rounded size-6"
                        @click="showEmojiPicker">{{
                            data.icon
                        }}</button>
                    <dialog ref="emojiPickerDialog" class="m-auto bg-transparent shadow z-10"
                        v-on-click-outside="hideEmojiPicker">
                        <EmojiPicker @select="(emoji: string) => { setIcon(emoji); hideEmojiPicker() }"
                            @remove="() => { setIcon(''); hideEmojiPicker() }" @close="hideEmojiPicker" />
                    </dialog>
                </div>
            </div>
            <div>
                <BlockList ref="blockList" :blockListId="data.blockListId" @empty="onEmpty">
                </BlockList>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import BlockList from '../BlockList.vue';
import { computed, ref, type Ref } from 'vue';
import EmojiPicker from '../EmojiPicker.vue';
import { vOnClickOutside } from '@vueuse/components';
import { useRepo } from '@/composables/useRepo';
import { useBlockEvents } from '@/composables/useBlockEvents';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    data: {
        type: Object as PropType<{ icon?: string, blockListId: string, textColor: string | null, backgroundColor: string | null }>,
        required: true
    },
})

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

const blockList: Ref<InstanceType<typeof BlockList> | undefined> = ref(undefined);
const emojiPickerDialog: Ref<HTMLDialogElement | undefined> = ref(undefined);

const showEmojiPicker = () => {
    if (emojiPickerDialog.value) {
        emojiPickerDialog.value.show();
    }
}
const hideEmojiPicker = () => {
    if (emojiPickerDialog.value) {
        emojiPickerDialog.value.close();
    }
}

const setIcon = (emoji: string) => {
    updateBlockData(
        props.id,
        {
            ...props.data,
            icon: emoji
        })
}

const onEmpty = () => {
    emit('deleteBlock');
}

function focusBlock(focusStart: boolean) {
    if (focusStart) {
        blockList.value?.focusFirstBlock();
    } else {
        blockList.value?.focusLastBlock();
    }
}

defineExpose({ focusBlock })
</script>

<style scoped></style>