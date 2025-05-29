export function useBlockEvents() {
    return {
        events: ['insertBlockAfter', 'replaceBlock', 'newBlock', 'focusBlock', 'focusPrevious', 'focusNext', 'deleteBlock']
    }
}