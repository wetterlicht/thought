<template>
    <div class="absolute left-full ml-2 bg-transparent shadow-lg z-10" :class="{
        '-translate-y-full': showAbove,
        'top-0': !showAbove,
    }">
        <div class="bg-white rounded-md border border-stone-300 w-fit min-w-64">
            <div class="p-4">
                <form>
                    <label for="block-context-menu-search">
                        <span class="sr-only">Search actions</span>
                    </label>
                    <input ref="search" type="text" id="block-context-menu-search"
                        class="w-full rounded-md border border-stone-300 text-sm py-1 px-3"
                        placeholder="Search actions &hellip;">
                </form>
            </div>
            <div class="px-2 pb-4 text-stone-900">
                <h2 class="text-sm mx-2 mb-2 text-stone-700">
                    {{ blockType }}
                </h2>
                <ul>
                    <li>
                        <div class="relative">
                            <button @click="toggleColorDropdown" :aria-expanded="isColorDropdownOpen"
                                :aria-controls="colorDropdownId" class="w-full py-1 px-2 rounded flex items-center gap-x-2
                             hover:bg-stone-200">
                                <PaintBrushIcon class="w-5"></PaintBrushIcon> Color
                                <ChevronRightIcon class="w-5 ml-auto"></ChevronRightIcon>
                            </button>

                            <div v-if="isColorDropdownOpen"
                                class="absolute left-full top-1/2 translate-x-1.5 z-20 -translate-y-1/2 shadow-lg bg-white rounded-md border border-stone-300 w-fit min-w-64">
                                <div class="px-2 pt-4 pb-4 text-stone-900">
                                    <h2 class="text-sm mx-2 mb-2 text-stone-700">
                                        Text Color
                                    </h2>
                                    <ul>
                                        <li>
                                            <button @click="emit('setTextColor', null)"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span
                                                    class="size-5 border border-stone-600 rounded  flex items-center justify-center"
                                                    aria-hidden="true">A</span>
                                                Default
                                                Text</button>
                                        </li>
                                        <li>
                                            <button @click="emit('setTextColor', 'red')"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span
                                                    class="size-5 text-red-600 border border-stone-600 rounded  flex items-center justify-center"
                                                    aria-hidden="true">A</span>
                                                Red
                                                Text</button>
                                        </li>
                                        <li>
                                            <button @click="emit('setTextColor', 'orange')"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span
                                                    class="size-5 text-orange-600 border border-stone-600 rounded  flex items-center justify-center"
                                                    aria-hidden="true">A</span>
                                                Orange
                                                Text</button>
                                        </li>
                                        <li>
                                            <button @click="emit('setTextColor', 'yellow')"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span
                                                    class="size-5 text-yellow-600 border border-stone-600 rounded  flex items-center justify-center"
                                                    aria-hidden="true">A</span>
                                                Yellow
                                                Text</button>
                                        </li>
                                    </ul>
                                    <hr class="text-stone-300 my-2">
                                    <h2 class="text-sm mx-2 mt-4 mb-2 text-stone-700">
                                        Background Color
                                    </h2>
                                    <ul>
                                        <li>
                                            <button @click="emit('setBackgroundColor', null)"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span class="size-5 border border-stone-600 rounded"
                                                    aria-hidden="true"></span>
                                                Default
                                                Background</button>
                                        </li>
                                        <li>
                                            <button @click="emit('setBackgroundColor', 'red')"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span class="size-5 bg-red-100 border border-stone-600 rounded"
                                                    aria-hidden="true"></span>
                                                Red
                                                Background</button>
                                        </li>
                                        <li>
                                            <button @click="emit('setBackgroundColor', 'orange')"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span class="size-5 bg-orange-100 border border-stone-600 rounded"
                                                    aria-hidden="true"></span>
                                                Orange
                                                Background</button>
                                        </li>
                                        <li>
                                            <button @click="emit('setBackgroundColor', 'yellow')"
                                                class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                                                <span class="size-5 bg-yellow-100 border border-stone-600 rounded"
                                                    aria-hidden="true"></span>
                                                Yellow
                                                Background</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <hr class="text-stone-300 my-2">
                <h2 class="text-sm mx-2 mt-4 mb-2 text-stone-700">
                    General
                </h2>
                <ul>
                    <li>
                        <button class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                            <DocumentDuplicateIcon class="w-5"></DocumentDuplicateIcon> Duplicate
                        </button>
                    </li>
                    <li>
                        <button class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                            <ArrowTurnUpRightIcon class="w-5"></ArrowTurnUpRightIcon> Move to
                        </button>
                    </li>
                    <li>
                        <button @click="emit('deleteBlock')"
                            class="w-full py-1 px-2 rounded flex items-center gap-x-2 hover:bg-stone-200">
                            <TrashIcon class="w-5"></TrashIcon> Delete
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowTurnUpRightIcon, DocumentDuplicateIcon, FaceSmileIcon, TrashIcon, PaintBrushIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref } from 'vue';

const props = defineProps({
    blockType: {
        type: String,
        required: true
    }
});

const search = ref();
const showAbove = ref(false);

const isColorDropdownOpen = ref(false);
const colorDropdownId = `block-color-dropdown`;
const toggleColorDropdown = () => {
    isColorDropdownOpen.value = !isColorDropdownOpen.value
}

onMounted(() => {
    // Show the context menu above the block if in the lower half of the screen
    const rect = search.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom > viewportHeight / 2) {
        showAbove.value = true;
    } else {
        showAbove.value = false;
    }
    // Focus the search input
    search.value.focus();
});

const emit = defineEmits(['deleteBlock', 'setBackgroundColor', 'setTextColor']);

</script>

<style scoped></style>