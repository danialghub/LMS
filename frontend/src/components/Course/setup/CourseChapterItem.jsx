import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { Edit, FolderPlus, GripVertical, Plus, X, Check } from "lucide-react";
import uniqid from 'uniqid';
import { useCourseStore } from '@/store/useCourseStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lectureTitleSchema } from '@/validators/courseSchema';
import { Link } from 'react-router';
import { useInstructorStore } from '../../../store/useInstructorStore';

// Constants
const PUBLISH_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published'
};

const STATUS_STYLES = {
    [PUBLISH_STATUS.DRAFT]: 'bg-slate-400/20 text-gray-800',
    [PUBLISH_STATUS.PUBLISHED]: 'bg-sky-500/20 text-sky-700'
};

// Status Badge Component
const StatusBadge = ({ status, isFree = false }) => {
    if (isFree) {
        return <div className='p-1 px-2 rounded-full bg-black text-white text-[11px]'>رایگان</div>;
    }

    const config = {
        [PUBLISH_STATUS.PUBLISHED]: { text: 'منتشر شده', className: 'bg-sky-700/90 text-white' },
        [PUBLISH_STATUS.DRAFT]: { text: 'پیش نویس', className: 'bg-[#5E6878] text-white/90' }
    };

    const { text, className } = config[status] || config[PUBLISH_STATUS.DRAFT];
    return <div className={`p-1 px-2 rounded-full ${className} text-[11px]`}>{text}</div>;
};

// Lecture Form Component
const LectureForm = ({ onSubmit, onCancel, defaultValue = "" }) => {
    const { register, handleSubmit, formState: { isValid }, reset } = useForm({
        resolver: zodResolver(lectureTitleSchema),
        defaultValues: { lectureTitle: defaultValue },
        mode: "onChange"
    });

    const handleCancel = () => {
        reset();
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 flex-1">
            <input
                type="text"
                {...register('lectureTitle')}
                className="form-input px-2 py-1 rounded text-sm flex-1"
                autoFocus
            />
            <div className='flex items-center gap-1'>
                <button
                    type="submit"
                    disabled={!isValid}
                    className="w-7 h-7 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                    title="ذخیره"
                >
                    <Check className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                    title="انصراف"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </form>
    );
};

// Lecture Item Component
const LectureItem = ({ id, lecture, lectureIndex, chapter, isDragging, onCreateLecture, isCreateMode, onCancelCreateLecture }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const { createLecture } = useCourseStore();
    const { instructorCourse: course } = useInstructorStore();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const handleSubmit = async (data) => {
        const newLecture = {
            lectureId: uniqid(),
            lectureTitle: data.lectureTitle,
            lectureOrder: chapter.chapterContent.length + 1,
            lecturePublishStatus: PUBLISH_STATUS.DRAFT,
            isLecturePublished: false
        };

        await createLecture(newLecture, chapter.chapterId);
        onCreateLecture(chapter._id, newLecture);
    };

    const handleCancel = () => {
        onCancelCreateLecture?.(id);
    };

    const statusClass = STATUS_STYLES[lecture.lecturePublishStatus] || STATUS_STYLES[PUBLISH_STATUS.DRAFT];

    return (
        <div ref={setNodeRef} style={style} className={`flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 transition-all ${isDragging ? 'opacity-50' : ''} ${statusClass}`}>
            <div className="flex items-center gap-3 flex-1">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="size-4 text-gray-500" />
                </div>

                {isCreateMode === id ? (
                    <LectureForm onSubmit={handleSubmit} onCancel={handleCancel} />
                ) : (
                    <p className={`text-sm ${lecture.lecturePublishStatus === PUBLISH_STATUS.DRAFT ? "text-gray-800" : "text-sky-700"}`}>
                        <span>جلسه {lectureIndex + 1}</span> : {lecture.lectureTitle}
                    </p>
                )}
            </div>

            {isCreateMode !== id && (
                <div className='flex items-center gap-1'>
                    <StatusBadge status={lecture.lecturePublishStatus} isFree={lecture.isLectureFree} />
                    <Link
                        to={`/instructor/courses/course-setup/${course._id}/chapter/${chapter.chapterId}/lecture-setup/${lecture.lectureId}`}
                        className="p-1.5 text-gray-600 hover:text-blue-500 transition-colors"
                        title="ویرایش جلسه"
                    >
                        <Edit className="size-4" />
                    </Link>
                </div>
            )}
        </div>
    );
};

// Chapter Header Component
const ChapterHeader = ({ chapter, isOpen, isEditing, editTitle, setEditTitle, onToggle, onSave, onCancel, onAddLecture, onEdit }) => {
    return (
        <div className="flex items-center justify-between p-4 py-3 bg-white">
            <div className="flex items-center gap-3 flex-1">
                <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-4 flex-1">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="form-input px-2 py-2 rounded text-sm flex-1"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && onSave()}
                        />
                        <div className='flex items-center gap-1'>
                            <button
                                onClick={onSave}
                                className="w-7 h-7 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                                title="ذخیره"
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-7 h-7 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                                title="انصراف"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={onToggle} className="flex items-center gap-2 flex-1 text-right">
                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                        <h3 className="text-base font-medium text-gray-800">{chapter.chapterTitle}</h3>
                    </button>
                )}
            </div>

            {!isEditing && (
                <>
                    <button onClick={onAddLecture} className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors" title="ایجاد جلسه جدید">
                        <FolderPlus className="w-4 h-4" />
                    </button>
                    <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors" title="ویرایش عنوان">
                        <Edit className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
    );
};

// Chapter Content Component
const ChapterContent = ({ lectures, chapter, isOpen, activeLectureId, isLectureCreateMode, onCreateLecture, onReorderLectures, onCancelCreateLecture }) => {
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
            // اضافه کردن تاخیر کوچک برای اطمینان از render شدن محتوا
            const timeout = setTimeout(() => {
                if (contentRef.current) {
                    setContentHeight(contentRef.current.scrollHeight);
                }
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            setContentHeight(0);
        }
    }, [isOpen, lectures.length]); // فقط به length وابسته باشه، نه کل lectures

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = lectures.findIndex(l => l.lectureId === active.id);
            const newIndex = lectures.findIndex(l => l.lectureId === over.id);
            onReorderLectures(oldIndex, newIndex);
        }
    };

    // جدا کردن جلسات واقعی از جلسات موقت برای نمایش
    const realLectures = lectures.filter(lec => !lec.isTemp);
    const tempLectures = lectures.filter(lec => lec.isTemp);

    const hasNoRealLectures = realLectures.length === 0;

    return (
        <div
            className="transition-all duration-300 ease-in-out overflow-hidden"
            style={{
                maxHeight: `${contentHeight}px`,
                opacity: isOpen ? 1 : 0,
                visibility: isOpen ? 'visible' : 'hidden'
            }}
        >
            <div ref={contentRef}>
                <div className="border-t border-gray-100">
                    {hasNoRealLectures && tempLectures.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-400 mb-2">این فصل جلسه‌ای ندارد</p>
                            <button
                                onClick={() => onCreateLecture(chapter.chapterId)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                افزودن جلسه جدید
                            </button>
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={lectures.map(l => l.lectureId)} strategy={verticalListSortingStrategy}>
                                {lectures.map((lecture, idx) => (
                                    <LectureItem
                                        key={lecture.lectureId}
                                        id={lecture.lectureId}
                                        lecture={lecture}
                                        lectureIndex={realLectures.findIndex(l => l.lectureId === lecture.lectureId)}
                                        chapter={chapter}
                                        isDragging={activeLectureId === lecture.lectureId}
                                        onCreateLecture={onCreateLecture}
                                        isCreateMode={isLectureCreateMode}
                                        onCancelCreateLecture={onCancelCreateLecture}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Chapter Item Component
const ChapterItem = ({
    id,
    chapter,
    chapterIndex,
    chapterOpen,
    setChapterOpen,
    isDragging,
    courseId,
    onSaveChapterTitle,
    onCancelEdit,
    isEditingChapter,
    setEditingChapterId
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const { patchLectureOrder, patchChapterFields } = useCourseStore();

    const [lectures, setLectures] = useState([]);
    const [editTitle, setEditTitle] = useState(chapter.chapterTitle);
    const [activeLectureId, setActiveLectureId] = useState(null);
    const [isLectureCreateMode, setIsLectureCreateMode] = useState(false);

    const isOpen = chapterOpen === id;

    const isEditing = isEditingChapter === chapter.chapterId;
    const style = { transform: CSS.Transform.toString(transform), transition };

    useEffect(() => {
        setLectures(chapter.chapterContent);
    }, [chapter.chapterContent]);

    const handleReorderLectures = useCallback(async (fromIndex, toIndex) => {
        // فیلتر کردن جلسات واقعی برای مرتب‌سازی
        const realLectures = lectures.filter(lec => !lec.isTemp);
        const tempLectures = lectures.filter(lec => lec.isTemp);

        const items = Array.from(realLectures);
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);
        const updatedChapters = items.slice(startIndex, endIndex + 1);

        // ترکیب جلسات واقعی مرتب شده با جلسات موقت
        setLectures([...items, ...tempLectures]);

        const bulkUpdate = updatedChapters.map(lec => ({
            lectureId: lec.lectureId,
            position: items.findIndex(item => item.lectureId === lec.lectureId)
        }));

        await patchLectureOrder(courseId, chapter.chapterId, bulkUpdate);
    }, [lectures, patchLectureOrder, courseId, chapter.chapterId]);

    const handleSaveChapterTitle = useCallback(async () => {
        if (editTitle.trim() && editTitle !== chapter.chapterTitle) {
            await patchChapterFields(courseId, chapter.chapterId, { chapterTitle: editTitle });
            onSaveChapterTitle?.(chapter.chapterId, editTitle);
        }
        setEditingChapterId?.(null);
    }, [editTitle, chapter.chapterId, chapter.chapterTitle, courseId, patchChapterFields, onSaveChapterTitle, setEditingChapterId]);

    const handleCancelChapterEdit = useCallback(() => {
        setEditTitle(chapter.chapterTitle);
        setEditingChapterId?.(null);
        onCancelEdit?.();
    }, [chapter.chapterTitle, setEditingChapterId, onCancelEdit]);

    const handleCreateLecture = useCallback((chapterId, newLecture) => {
        if (newLecture) {
            // جلسه واقعی اضافه شد
            setLectures(prev => prev.filter(lec => !lec.isTemp).concat(newLecture));
            setIsLectureCreateMode(false);
        } else if (chapterId) {
            // ایجاد جلسه موقت جدید
            const tempLecture = {
                lectureId: uniqid(),
                lectureTitle: "",
                isTemp: true,
                lectureOrder: lectures.filter(lec => !lec.isTemp).length + 1,
                lecturePublishStatus: PUBLISH_STATUS.DRAFT,
                isLecturePublished: false
            };
            setLectures(prev => [...prev, tempLecture]);
            // فقط اگر فصل بسته است، آن را باز کن
            if (!isOpen) {
                setChapterOpen(chapterId);
            }
            setIsLectureCreateMode(tempLecture.lectureId);
        }
    }, [lectures.length, setChapterOpen, isOpen]);

    const handleCancelCreateLecture = useCallback((tempLectureId) => {
        setLectures(prev => prev.filter(lec => lec.lectureId !== tempLectureId));
        setIsLectureCreateMode(false);
    }, []);

    return (
        <div ref={setNodeRef} style={style} className={`transition-all duration-200 ${isDragging ? 'opacity-50' : ''}`}>
            <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div {...attributes} {...listeners}>
                    <ChapterHeader
                        chapter={chapter}
                        isOpen={isOpen}
                        isEditing={isEditing}
                        editTitle={editTitle}
                        setEditTitle={setEditTitle}
                        onToggle={() => setChapterOpen(prev => prev === id ? "" : id)}
                        onSave={handleSaveChapterTitle}
                        onCancel={handleCancelChapterEdit}
                        onAddLecture={() => handleCreateLecture(chapter.chapterId)}
                        onEdit={() => setEditingChapterId?.(chapter.chapterId)}
                    />
                </div>

                <ChapterContent
                    lectures={lectures}
                    chapter={chapter}
                    isOpen={isOpen}
                    activeLectureId={activeLectureId}
                    isLectureCreateMode={isLectureCreateMode}
                    onCreateLecture={handleCreateLecture}
                    onReorderLectures={handleReorderLectures}
                    onCancelCreateLecture={handleCancelCreateLecture}
                />
            </div>
        </div>
    );
};

export default ChapterItem;