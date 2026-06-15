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
    TouchSensor,
} from '@dnd-kit/core';
import { Edit, FolderPlus, GripVertical, Plus, X, Check, ChevronDown, Play, Lock, Unlock, FileText } from "lucide-react";
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

// Improved Blue Color System
const COLORS = {
    chapter: {
        gradient: 'from-blue-50 to-blue-100',
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        hover: 'hover:from-blue-700 hover:to-blue-800'
    },
    lecture: {
        draft: {
            bg: 'bg-white',
            border: 'border-gray-100',
            text: 'text-gray-700',
            badge: 'bg-gray-100 text-gray-600',
            icon: 'text-gray-400'
        },
        published: {
            bg: 'bg-gradient-to-r from-blue-50 to-sky-50',
            border: 'border-blue-100',
            text: 'text-blue-800',
            badge: 'bg-blue-100 text-blue-700',
            icon: 'text-blue-500'
        },
        free: {
            bg: 'bg-gradient-to-r from-cyan-50 to-blue-50',
            border: 'border-cyan-100',
            text: 'text-cyan-800',
            badge: 'bg-cyan-100 text-cyan-700',
            icon: 'text-cyan-500'
        }
    }
};

// Status Badge Component
const StatusBadge = ({ status, isFree = false }) => {
    if (isFree) {
        return (
            <div className='px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] sm:text-[11px] font-medium shadow-sm whitespace-nowrap flex items-center gap-1'>
                <Unlock className="w-2.5 h-2.5" />
                <span>رایگان</span>
            </div>
        );
    }

    const config = {
        [PUBLISH_STATUS.PUBLISHED]: { 
            text: 'منتشر شده', 
            className: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-sm',
            icon: <Play className="w-2.5 h-2.5" />
        },
        [PUBLISH_STATUS.DRAFT]: { 
            text: 'پیش نویس', 
            className: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm',
            icon: <FileText className="w-2.5 h-2.5" />
        }
    };

    const { text, className, icon } = config[status] || config[PUBLISH_STATUS.DRAFT];
    return (
        <div className={`px-2 sm:px-2.5 py-0.5 rounded-full ${className} text-[10px] sm:text-[11px] font-medium flex items-center gap-1 whitespace-nowrap`}>
            {icon}
            <span>{text}</span>
        </div>
    );
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            <input
                type="text"
                {...register('lectureTitle')}
                className="form-input px-3 py-2 sm:py-1.5 rounded-lg text-sm flex-1 bg-white border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                autoFocus
                placeholder="عنوان جلسه..."
            />
            <div className='flex items-center justify-end sm:justify-start gap-2'>
                <button
                    type="submit"
                    disabled={!isValid}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                    title="ذخیره"
                >
                    <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                    title="انصراف"
                >
                    <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
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

    const getLectureColors = () => {
        if (lecture.isLectureFree) return COLORS.lecture.free;
        if (lecture.lecturePublishStatus === PUBLISH_STATUS.PUBLISHED) return COLORS.lecture.published;
        return COLORS.lecture.draft;
    };

    const colors = getLectureColors();

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 ${colors.bg} border-b ${colors.border} last:border-b-0 gap-2 sm:gap-0 transition-all duration-200 ${isDragging ? 'opacity-50' : 'hover:shadow-sm'}`}
        >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 w-full">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-manipulation p-1 hover:bg-gray-100 rounded transition-colors">
                    <GripVertical className={`size-4 ${colors.icon}`} />
                </div>

                {isCreateMode === id ? (
                    <LectureForm onSubmit={handleSubmit} onCancel={handleCancel} />
                ) : (
                    <div className="flex items-center gap-2 flex-1">
                        <div className={`w-6 h-6 rounded-full ${colors.badge} flex items-center justify-center text-xs font-bold shadow-sm`}>
                            {lectureIndex + 1}
                        </div>
                        <p className={`text-xs sm:text-sm break-words flex-1 font-medium ${colors.text}`}>
                            {lecture.lectureTitle}
                        </p>
                    </div>
                )}
            </div>

            {isCreateMode !== id && (
                <div className='flex items-center gap-2 self-end sm:self-center mt-1 sm:mt-0'>
                    <StatusBadge status={lecture.lecturePublishStatus} isFree={lecture.isLectureFree} />
                    <Link
                        to={`/instructor/courses/course-setup/${course._id}/chapter/${chapter.chapterId}/lecture-setup/${lecture.lectureId}`}
                        className={`p-1.5 rounded-lg transition-all duration-200 ${colors.badge} hover:shadow-md`}
                        title="ویرایش جلسه"
                    >
                        <Edit className={`size-3.5 sm:size-4 ${colors.icon}`} />
                    </Link>
                </div>
            )}
        </div>
    );
};

// Chapter Header Component
const ChapterHeader = ({ chapter, isOpen, isEditing, editTitle, setEditTitle, onToggle, onSave, onCancel, onAddLecture, onEdit }) => {
    return (
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r ${COLORS.chapter.gradient} text-black/80 gap-3 sm:gap-0`}>
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="cursor-grab active:cursor-grabbing touch-manipulation p-1 hover:bg-white/10 rounded transition-colors">
                    <GripVertical className="w-4 h-4 text-black/80" />
                </div>

                {isEditing ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="px-3 py-2 rounded-lg text-sm flex-1 bg-white/95 text-gray-800 border-0 focus:ring-2 focus:ring-white focus:outline-none"
                            autoFocus
                            placeholder="عنوان فصل..."
                            onKeyPress={(e) => e.key === 'Enter' && onSave()}
                        />
                        <div className='flex items-center justify-end sm:justify-start gap-2'>
                            <button
                                onClick={onSave}
                                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-gray-400/5 hover:bg-black/10 backdrop-blur-sm text-green-500 transition-all duration-200 flex items-center justify-center"
                                title="ذخیره"
                            >
                                <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                            <button
                                onClick={onCancel}
                                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-gray-400/5 hover:bg-black/10 backdrop-blur-sm text-red-500 transition-all duration-200 flex items-center justify-center"
                                title="انصراف"
                            >
                                <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={onToggle} 
                        className="flex items-center gap-2 flex-1 text-right justify-between sm:justify-start group"
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-4 h-4 text-black" />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold break-words">{chapter.chapterTitle}</h3>
                        </div>
                    </button>
                )}
            </div>

            {!isEditing && (
                <div className="flex items-center justify-end gap-1">
                    <button 
                        onClick={onAddLecture} 
                        className="p-1.5 rounded-lg hover:bg-black/20 backdrop-blur-sm transition-all duration-200 text-black/90 hover:black-white"
                        title="ایجاد جلسه جدید"
                    >
                        <FolderPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                        onClick={onEdit} 
                        className="p-1.5 rounded-lg hover:bg-black/20 backdrop-blur-sm transition-all duration-200 text-black/90 hover:text-black"
                        title="ویرایش عنوان"
                    >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
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
            const timeout = setTimeout(() => {
                if (contentRef.current) {
                    setContentHeight(contentRef.current.scrollHeight);
                }
            }, 50);
            return () => clearTimeout(timeout);
        } else {
            setContentHeight(0);
        }
    }, [isOpen, lectures.length]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = lectures.findIndex(l => l.lectureId === active.id);
            const newIndex = lectures.findIndex(l => l.lectureId === over.id);
            onReorderLectures(oldIndex, newIndex);
        }
    };

    const realLectures = lectures.filter(lec => !lec.isTemp);
    const tempLectures = lectures.filter(lec => lec.isTemp);
    const hasNoRealLectures = realLectures.length === 0;

    return (
        <div
            className="transition-all duration-300 ease-in-out overflow-hidden bg-gray-50"
            style={{
                maxHeight: `${contentHeight}px`,
                opacity: isOpen ? 1 : 0,
                visibility: isOpen ? 'visible' : 'hidden'
            }}
        >
            <div ref={contentRef}>
                <div className={`border-t-2 ${COLORS.chapter.border}`}>
                    {hasNoRealLectures && tempLectures.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-blue-400" />
                            </div>
                            <p className="text-sm text-gray-500 mb-3">این فصل جلسه‌ای ندارد</p>
                            <button
                                onClick={() => onCreateLecture(chapter.chapterId)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-sky-50 text-white rounded-lg hover:from-blue-100 hover:to-sky-100 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                افزودن جلسه جدید
                            </button>
                        </div>
                    ) : (
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={lectures.map(l => l.lectureId)} strategy={verticalListSortingStrategy}>
                                <div className="divide-y divide-gray-100">
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
                                </div>
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
        const realLectures = lectures.filter(lec => !lec.isTemp);
        const tempLectures = lectures.filter(lec => lec.isTemp);

        const items = Array.from(realLectures);
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);
        const updatedChapters = items.slice(startIndex, endIndex + 1);

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
            setLectures(prev => prev.filter(lec => !lec.isTemp).concat(newLecture));
            setIsLectureCreateMode(false);
        } else if (chapterId) {
            const tempLecture = {
                lectureId: uniqid(),
                lectureTitle: "",
                isTemp: true,
                lectureOrder: lectures.filter(lec => !lec.isTemp).length + 1,
                lecturePublishStatus: PUBLISH_STATUS.DRAFT,
                isLecturePublished: false
            };
            setLectures(prev => [...prev, tempLecture]);
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
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`transition-all duration-200 ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="w-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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