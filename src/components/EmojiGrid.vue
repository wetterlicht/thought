<template>
    <ul class="grid grid-cols-16 gap-px">
        <li v-for="emoji in group.emojis">
            <button @click="emit('select', emoji)"
                class=" text-xl border border-transparent hover:border-stone-600  rounded-md p-0.5">
                {{ emoji }}
            </button>
        </li>
    </ul>
</template>

<script setup lang="ts">
defineProps({
    group: {
        type: Object as () => { emojis: string[] },
        required: true
    }
});
const emit = defineEmits(['select']);
</script>

<style scoped></style>