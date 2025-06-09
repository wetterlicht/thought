<template>
    <div>
        <div v-if="page">
            <RouterLink :to="`/workspaces/${currentWorkspace!.id}/pages/${page.id}`"
                class="flex items-center gap-1 cursor-default w-fit rounded bg-stone-100 border border-stone-300 hover:border-stone-600 px-1">
                <div class="flex items-center gap-1">
                    <div v-if="page.icon">{{ page.icon }}</div>
                    <DocumentTextIcon class="size-5 shrink-0" v-else></DocumentTextIcon>
                    <div class="truncate flex-grow">{{ page.title }}</div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import { useRepo } from '@/composables/useRepo';
import type { AutomergeUrl } from '@automerge/automerge-repo';
import { DocumentTextIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    id: {
        type: String as unknown as PropType<AutomergeUrl>,
        required: true
    },
    data: {
        type: Object as PropType<{ pageId: AutomergeUrl, textColor: string | null, backgroundColor: string | null }>,
        required: true
    },
})

const { currentWorkspace, pageById } = useRepo();

const page = computed(() => {
    return pageById.value(props.data.pageId);
});

function focusBlock(focusStart: boolean) {

}

defineExpose({ focusBlock })
</script>

<style scoped></style>