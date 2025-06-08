import { onMounted, ref } from "vue";

const targetBlockId = ref<string | null>(null);
const isActive = ref(true);

const setActive = (active: boolean) => {
    isActive.value = active;
};

export function useTargetBlock() {

    onMounted(() => {
        const editor = document.querySelector('main');
        if (editor) {
            editor?.addEventListener('mousemove', (event) => {
                if (!isActive.value) {
                    return;
                }
                let target = null;
                const hoveredBlock = findHoveredBlock(event.currentTarget as Element, event.clientX, event.clientY);
                if (hoveredBlock) {
                    target = hoveredBlock;
                    // If a child block is closer to the mouse position, than the top left of the hovered block, make that the target
                    const hoveredRect = hoveredBlock.getBoundingClientRect();
                    const childBlocks = hoveredBlock.querySelectorAll('[data-block-id]');
                    let closestChild = null;
                    let closestDistance = Infinity;
                    for (const child of childBlocks) {
                        const rect = child.getBoundingClientRect();
                        const distance = Math.sqrt(
                            Math.pow(event.clientX - rect.left, 2) +
                            Math.pow(event.clientY - rect.top, 2)
                        );
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestChild = child;
                        }
                    }
                    if (closestChild && closestDistance < Math.sqrt(
                        Math.pow(event.clientX - hoveredRect.left, 2) +
                        Math.pow(event.clientY - hoveredRect.top, 2)
                    )) {
                        target = closestChild;
                    }
                } else {
                    // If no block is hovered, get the closest top-level block
                    const blocks = document.querySelectorAll('[data-block-id]');
                    const topLevelBlocks = Array.from(blocks).filter(block => {
                        const ancestor = block.parentElement?.closest('[data-block-id]');
                        return ancestor === null;
                    });
                    let closestDistance = Infinity;
                    for (const block of topLevelBlocks) {
                        const rect = block.getBoundingClientRect();
                        const distance = Math.sqrt(
                            Math.pow(event.clientX - rect.left, 2) +
                            Math.pow(event.clientY - rect.top, 2)
                        );
                        // Find the closest block to the mouse position
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            target = block;
                        }
                    }
                }
                targetBlockId.value = target ? target.getAttribute('data-block-id') : null;
            });

            editor?.addEventListener('mouseout', (event) => {
                if (!isActive.value) {
                    return;
                }
                if (event.target !== editor) {
                    return;
                }
                // Clear the targetBlockId when the mouse leaves the editor
                targetBlockId.value = null;
            });
        }
    });

    function findHoveredBlock(element: Element, mouseX: number, mouseY: number): Element | null {
        let currentElement = element;
        while (currentElement.children.length > 0) {
            // Find the child that is being hovered over
            let hoveredChild = null;
            for (const child of currentElement.children) {
                const rect = child.getBoundingClientRect();
                if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                    hoveredChild = child;
                    break;
                }
            }
            if (hoveredChild) {
                currentElement = hoveredChild;
            } else {
                break;
            }
        }
        const block = currentElement.closest('[data-block-id]');
        return block ? block : null;
    }

    return {
        targetBlockId,
        isActive,
        setActive,
    }
}