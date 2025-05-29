<template>
    <div>
        <div class="bg-white rounded-md border border-stone-300 w-fit pb-4">
            <div class="px-3 mb-4 border-b border-stone-300 pt-4 pb-3 flex gap-x-4 items-center">
                <form class="flex-grow">
                    <input v-model="query" type="text" id="emoji-picker-search"
                        class="w-full rounded-md border border-stone-300 text-sm py-1 px-3"
                        placeholder="Filter &hellip;">
                </form>
                <button @click="emit('remove')"
                    class=" text-sm text-stone-600 rounded hover:bg-stone-200 py-1 px-3 ml-auto block">Remove</button>
                <button @click="emit('close')"
                    class=" text-sm text-stone-600 rounded hover:bg-stone-200 py-1 px-3 ml-auto block">Close</button>
            </div>
            <div class="h-96 w-[32rem] overflow-y-auto">
                <template v-if="filteredEmojis.length === 0">
                    <div class="text-center text-sm text-stone-600 p-4">No results</div>
                </template>
                <template v-else-if="query">
                    <div class="px-3">
                        <ul class="grid grid-cols-16 gap-px">
                            <li v-for="emoji in filteredEmojis" :key="emoji.emoji">
                                <button @click="emit('select', emoji.emoji)"
                                    class=" text-xl border border-transparent hover:border-stone-600 rounded-md p-0.5">
                                    {{ emoji.emoji }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <div v-for="group in groups" class="mb-6 px-3">
                        <div class="text-sm text-stone-600 mb-1">{{ group.category }}</div>
                        <EmojiGrid :group="group" @select="emit('select', $event)"></EmojiGrid>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getEmojis } from "unicode-emoji";
import { computed, ref } from "vue";
import EmojiGrid from './EmojiGrid.vue';
const emit = defineEmits(['select', 'remove', 'close']);
const emojis = getEmojis();

const query = ref('');

const categoryNames = {
    "face-emotion": "Smileys & Emotion",
    'food-drink': "Food & Drink",
    'animals-nature': "Animals & Nature",
    'activities-events': "Activities & Events",
    'person-people': "Person & People",
    'travel-places': "Travel & Places",
    'objects': "Objects & Symbols",
    'symbols': "Symbols",
    'flags': "Flags",

}

const filteredEmojis = computed(() => {
    if (!query.value) {
        return emojis;
    }
    const lowercaseQuery = query.value.toLowerCase();
    const result = emojis.filter((emoji) => emoji.description.toLowerCase().includes(lowercaseQuery) || emoji.emoji.includes(lowercaseQuery));
    return result;
});

const groups = computed(() => {
    return emojis.map((emoji) => {
        return {
            category: categoryNames[emoji.category as keyof typeof categoryNames] || emoji.category,
            emoji: emoji.emoji,
        }
    }).reduce((acc, cur) => {
        const existingGroup = acc.find(g => g.category === cur.category);
        if (existingGroup) {
            existingGroup.emojis.push(cur.emoji);
        } else {
            acc.push({
                category: cur.category,
                emojis: [cur.emoji],
            });
        }
        return acc;
    }, [] as { category: string, emojis: string[] }[])
        .filter(group => group.emojis.length > 0);
})

</script>

<style scoped></style>