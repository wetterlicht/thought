<template>
    <div class="bg-white rounded-md border border-stone-300 shadow-md w-fit min-w-64 p-1">
        <ul>
            <li>
                <button
                    class="w-full text-stone-600 flex items-center gap-1 hover:text-black hover:bg-stone-200 rounded-lg px-2 py-1"
                    @click="emit('delete')">
                    <TrashIcon class="size-5"></TrashIcon><span class="text-sm text-stone-600">Delete</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['delete']);

</script>

<style scoped></style>