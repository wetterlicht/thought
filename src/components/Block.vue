<template>
    <div :data-block-id="block.id" class="relative flex gap-1">
        <div class="size-6 shrink-0 relative">
            <button ref="contextMenuToggle" v-show="block.id === targetBlockId" @click="toggleContextMenu"
                :aria-expanded="isContextMenuOpen" :aria-controls="contextMenuId"
                class="my-0.5 size-6 border border-stone-300 text-stone-600 hover:border-stone-600 focus-visible:border-stone-600 hover:text-black focus-visible:text-black rounded">
                <EllipsisHorizontalIcon class="w-5"></EllipsisHorizontalIcon>
            </button>
            <BlockContextMenu v-if="isContextMenuOpen" :blockType="block.type" :id="contextMenuId" ref="menu"
                @keydown.esc="closeContextMenu" v-on-click-outside="onClickOutside" @deleteBlock="emit('deleteBlock')"
                @setTextColor="onSetTextColor" @setBackgroundColor="onSetBackgroundColor" class="absolute">
            </BlockContextMenu>
        </div>
        <component ref="blockComponent" class="px-1 py-[2px] grow-1" :is="block.component" :id="block.id"
            :data="block.data" @replaceBlock="emit('replaceBlock')"
            @insertBlockAfter="(type: string) => emit('insertBlockAfter', type)" @newBlock="emit('newBlock')"
            @focusPrevious="emit('focusPrevious')" @focusBlock="emit('focusBlock')" @focusNext="emit('focusNext')">
        </component>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    block: {
        type: Object,
        required: true
    }
});
import { useTargetBlock } from '@/composables/useTargetBlock';
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/outline';
import { ref, watch } from 'vue';
import BlockContextMenu from './BlockContextMenu.vue';
import { vOnClickOutside } from '@vueuse/components'
import { useFocusWithin } from '@vueuse/core';
import { useRepo } from '@/composables/useRepo';

const emit = defineEmits(['empty', 'focusPrevious', 'focusNext', 'replaceBlock', 'insertBlockAfter', 'newBlock', 'focusBlock', 'deleteBlock']);
const { updateBlockData } = useRepo();

const { targetBlockId, setActive } = useTargetBlock();

const blockComponent = ref();
const isContextMenuOpen = ref(false);
const menu = ref()
const contextMenuToggle = ref<HTMLButtonElement | null>(null);
const contextMenuId = `block-context-menu-${props.block.id}`;
const { focused } = useFocusWithin(menu)

defineExpose({
    focusBlock: () => {
        if (blockComponent.value) {
            blockComponent.value.focusBlock.value();
        }
    },
})

const onClickOutside = (event: Event) => {
    if (event.target && contextMenuToggle.value && contextMenuToggle.value.contains(event.target as Node)) {
        return;
    }
    closeContextMenu();
};

watch(focused, (focused) => {
    if (focused) {
        openContextMenu();
    } else {
        closeContextMenu();
    }
})

const toggleContextMenu = () => {
    if (isContextMenuOpen.value) {
        closeContextMenu();
    } else {
        openContextMenu();
    }
};

const openContextMenu = () => {
    setActive(false);
    isContextMenuOpen.value = true;
};

const closeContextMenu = () => {
    setActive(true);
    isContextMenuOpen.value = false;
};

const onSetTextColor = (textColorClass: string | null) => {
    updateBlockData(props.block.id, { ...props.block.data, textColor: textColorClass });
    closeContextMenu();
}

const onSetBackgroundColor = (backgroundColorClass: string | null) => {
    updateBlockData(props.block.id, { ...props.block.data, backgroundColor: backgroundColorClass });
    closeContextMenu();
}

</script>

<style scoped></style>