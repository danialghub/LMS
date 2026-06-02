// hooks/useDragAndDrop.js
import { useState } from 'react';

export const useDragAndDrop = (items, onReorder) => {
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    const handleDragStart = (e, index, type, parentIndex = null) => {
        setDraggedItem({ index, type, parentIndex });
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.4';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragOver = (e, index, type, parentIndex = null) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!draggedItem) return;

        setDragOverItem({ index, type, parentIndex });
    };

    const handleDrop = (e, targetIndex, targetType, targetParentIndex = null) => {
        e.preventDefault();
        e.target.style.opacity = '1';

        if (!draggedItem) return;

        const { index: sourceIndex, type: sourceType, parentIndex: sourceParentIndex } = draggedItem;

        // جلوگیری از drop در جای خودش
        if (sourceIndex === targetIndex && sourceType === targetType && sourceParentIndex === targetParentIndex) {
            setDraggedItem(null);
            setDragOverItem(null);
            return;
        }

        onReorder({
            sourceIndex,
            sourceType,
            sourceParentIndex,
            targetIndex,
            targetType,
            targetParentIndex
        });

        setDraggedItem(null);
        setDragOverItem(null);
    };

    return {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
        draggedItem,
        dragOverItem
    };
};