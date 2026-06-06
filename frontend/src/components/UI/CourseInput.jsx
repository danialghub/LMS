import React, { useCallback, useEffect, useState } from 'react'
import { Edit, Image, ImageIcon, Loader2, MinusCircle, Plus, PlusCircle, UploadCloud, XIcon } from 'lucide-react'
import {
    courseTitleSchema, courseDescriptionSchema, courseThumbnailSchema, coursePriceSchema, courseDiscountSchema,
    courseContentSchema
} from '@/validators/courseSchema'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCourseStore } from '../../store/useCourseStore'
import { RichTextEditor } from '@/components/index'
import { formatPrice } from '@/lib/helper'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CourseChapterItem } from '@/components/index';
import uniqid from 'uniqid'

const CourseTitleInput = ({ courseId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { patchCourseFields } = useCourseStore()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm(
        {
            resolver: zodResolver(courseTitleSchema),
            values: { courseTitle: value || "" },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchCourseFields(courseId, data)

        setIsEditing(false)

    }
    return (
        <div className='w-full py-4 px-6 bg-slate-100 rounded-md '>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-lg'>عنوان دوره</h3>
                <div>
                    <button
                        className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-2 duration-150 cursor-pointer'
                        onClick={() => setIsEditing(prev => !prev)}>

                        {isEditing ? <XIcon /> : <Edit />}
                    </button>
                </div>
            </div>

            <div>
                {isEditing
                    ? <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='my-3'>
                            <input
                                disabled={isSubmitting}
                                type='text' className='form-input text-sm rounded p-2 ' {...register('courseTitle')} />
                            <p className='text-[12px] text-red-500 pt-1'>{errors.courseTitle?.message}</p>
                        </div>
                        <button
                            disabled={isSubmitting || !isValid}
                            className='btn-primary' type='submit'>ذخیره</button>
                    </form >
                    : <h4 className='text-black/70 text-sm mt-3 p-2'>{watch('courseTitle')}</h4>

                }
            </div>
        </div>
    )
}

const CourseDescriptionInput = ({ courseId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value || "")

    const { patchCourseFields } = useCourseStore()
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid },
    } = useForm(
        {
            resolver: zodResolver(courseDescriptionSchema),
            values: { courseDescription: value || "" },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchCourseFields(courseId, data)
        setDisplayValue(data.courseDescription)

        setIsEditing(false)

    }
    return (
        <div className='w-full bg-slate-100 rounded-md py-4'>
            <div className='flex items-center justify-between   px-6'>
                <h3 className='font-bold text-lg'>توضیحات دوره</h3>
                <div>
                    <button
                        className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-2 duration-150 cursor-pointer'
                        onClick={() => setIsEditing(prev => !prev)}>

                        {isEditing ? <XIcon /> : <Edit />}
                    </button>
                </div>
            </div>

            <div>
                {isEditing
                    ?
                    <div className='   px-6 '>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='my-3 max-h-[20vh] overflow-y-auto'>

                                {/* <input type='text'  {...register('courseDescription')} className='form-input' /> */}
                                <RichTextEditor
                                    name="courseDescription"
                                    control={control}
                                />

                                <p className='text-[12px] text-red-500 pt-1'>{errors.courseDescription?.message}</p>
                            </div>
                            <button
                                disabled={isSubmitting || !isValid}
                                className='btn-primary ' type='submit'>ذخیره</button>
                        </form >
                    </div>
                    : <div className=' max-h-[15vh] overflow-y-auto'>
                        <h4
                            className='break-words whitespace-normal text-black/60 text-sm mt-3 p-2 px-4'
                            dangerouslySetInnerHTML={{ __html: displayValue }}
                        />
                    </div>

                }
            </div>
        </div>
    )
}

const CourseThumbnailInput = ({ courseId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value || "")

    const { patchCourseFields } = useCourseStore()
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        resolver: zodResolver(courseThumbnailSchema),
        values: { courseThumbnail: value || null }, // Use null instead of empty string
        mode: "onChange"
    });

    const toggleEdit = () => {
        setIsEditing(prev => !prev)
        reset()
        if (isEditing) {
            setDisplayValue(value)
        } else {
            setDisplayValue('')
        }
    }

    const onSubmit = async (data) => {
        if (!data.courseThumbnail) return

        const form = new FormData()
        form.append("file", data.courseThumbnail)


        await patchCourseFields(courseId, form)
        setDisplayValue(URL.createObjectURL(data.courseThumbnail))
        reset({ courseThumbnail: undefined })

        // ریست کردن فرم با مقدار خالی برای فایل

        setIsEditing(false)
    }

    const changeThumb = () => {
        reset()
        setDisplayValue('')
    }
    return (
        <div className='w-full bg-slate-100 rounded-md mb-6 px-6 pt-4'>
            <div className='flex items-center justify-between   '>
                <h3 className='font-bold text-lg'>پوستر دوره</h3>
                <div>
                    <button
                        className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-2 duration-150 cursor-pointer '
                        onClick={toggleEdit}>

                        {isEditing ? <XIcon /> : value ? <Edit /> : <Plus />}
                    </button>
                </div>
            </div>

            <div>
                {isEditing
                    ?
                    <div className=' py-4   '>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='my-3 border-2 border-slate-200 rounded-md relative'>
                                {displayValue
                                    ? <div>
                                        <img src={displayValue} className='aspect-video transform-cpu' alt="" />
                                        <button
                                            onClick={changeThumb}
                                            className='size-7 absolute cursor-pointer top-2 left-2 z-10 text-white '><XIcon /></button>
                                    </div>
                                    :
                                    <label className='aspect-video flex flex-col items-center justify-center text-black/70'>
                                        <Controller
                                            name="courseThumbnail"
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onBlur={onBlur}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        setDisplayValue(URL.createObjectURL(file));
                                                        onChange(file)
                                                    }}
                                                    ref={ref}
                                                />
                                            )}
                                        />
                                        <div className='flex flex-col justify-center items-center gap-2 text-black/70'>
                                            <UploadCloud size={40} className='cursor-pointer' />
                                            <p className='text-sm'>حداکثر 4 مگابایت</p>
                                        </div>
                                    </label>


                                }


                                <p className='text-[12px] text-red-500 pt-1'>{errors.courseThumbnail?.message}</p>
                            </div>
                            <button
                                disabled={isSubmitting || !isValid}
                                className='btn-primary mx-auto px-6 py-1' type='submit'>آپلود</button>
                        </form >
                    </div>
                    : <div className='mb-6 mt-3  bg-slate-200'>
                        {displayValue
                            ? <img src={displayValue} className='aspect-video' alt="" />
                            : <div className='aspect-video flex flex-col items-center justify-center text-black/70'>
                                <ImageIcon size={40} />
                                <p>بدون عکس</p>
                            </div>

                        }
                    </div>

                }
            </div>
        </div>
    )
}


const CoursePriceInput = ({ courseId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(Number(value) || 0)
    const { patchCourseFields } = useCourseStore()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm(
        {
            resolver: zodResolver(coursePriceSchema),
            values: { coursePrice: Number(displayValue) || 0 },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchCourseFields(courseId, data)
        setDisplayValue(data.coursePrice)
        setIsEditing(false)

    }
    return (
        <div className='w-full py-4 px-6 bg-slate-100 rounded-md '>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-lg'>مبلغ دوره</h3>
                <div>
                    <button
                        className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-2 duration-150 cursor-pointer'
                        onClick={() => setIsEditing(prev => !prev)}>

                        {isEditing ? <XIcon /> : <Edit />}
                    </button>
                </div>
            </div>

            <div>
                {isEditing
                    ? <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='my-3'>
                            <input
                                disabled={isSubmitting}
                                type='number'
                                className='form-input text-sm rounded p-2 font-Dirooz-FD'
                                {...register('coursePrice', { valueAsNumber: true })}


                            />
                            <p className='text-[12px] text-red-500 pt-1'>{errors.coursePrice?.message}</p>
                        </div>
                        <button
                            disabled={isSubmitting || !isValid}
                            className='btn-primary' type='submit'>ذخیره</button>
                    </form >
                    : value
                        ? <h4 className={`text-black/70 w-fit rounded-md text-[15px] mt-3 p-2 ${displayValue === 0 && "text-blue-700 bg-blue-100"} `}>
                            {displayValue === 0 ? "رایگان" : `${formatPrice(displayValue)} تومان`}
                        </h4>
                        : <h4 className='text-black/70 text-[15px] mt-3 p-2'>مبلغی تعریف نشده</h4>

                }
            </div>
        </div >
    )
}
const CourseDiscountInput = ({ courseId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value || 0)
    const { patchCourseFields } = useCourseStore()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm(
        {
            resolver: zodResolver(courseDiscountSchema),
            values: { courseDiscount: Number(displayValue) || 0 },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchCourseFields(courseId, data)
        setDisplayValue(data.courseDiscount)
        setIsEditing(false)

    }
    return (
        <div className='w-full py-4 px-6 bg-slate-100 rounded-md '>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-lg'>تخفیف دوره</h3>
                <div>
                    <button
                        className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-2 duration-150 cursor-pointer'
                        onClick={() => setIsEditing(prev => !prev)}>

                        {isEditing ? <XIcon /> : <Edit />}
                    </button>
                </div>
            </div>

            <div>
                {isEditing
                    ? <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='my-3'>
                            <input
                                disabled={isSubmitting}
                                type='number'
                                min={0}
                                max={100}
                                className='form-input text-sm rounded p-2 font-Dirooz-FD'
                                {...register('courseDiscount', { valueAsNumber: true })}


                            />
                            <p className='text-[12px] text-red-500 pt-1'>{errors.courseDiscount?.message}</p>
                        </div>
                        <button
                            disabled={isSubmitting || !isValid}
                            className='btn-primary' type='submit'>ذخیره</button>
                    </form >
                    :
                    <h4 className='text-blue-700 w-fit rounded-md  text-sm bg-blue-100  mt-3 p-2 font-bold font-Dirooz-FD'>{displayValue}%
                    </h4>


                }
            </div>
        </div>
    )
}


const CourseChapterInput = ({ value, courseId }) => {
    const [chapterOpen, setChapterOpen] = useState("");
    const [activeId, setActiveId] = useState(null);
    const [isAddingChapter, setIsAddingChapter] = useState(false);
    const [editingChapterId, setEditingChapterId] = useState(null);
    const [chapters, setChapters] = useState(value || []);

    const { createChapter, isReordering, patchChapterOrder, patchChapterFields } = useCourseStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        reset
    } = useForm({
        resolver: zodResolver(courseContentSchema),
        defaultValues: { chapterTitle: "" },
        mode: "onChange"
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    const moveChapter = useCallback(async (fromIndex, toIndex) => {
        const items = Array.from(chapters);
        const [movedItem] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, movedItem);

        const startIndex = Math.min(fromIndex, toIndex);
        const endIndex = Math.max(fromIndex, toIndex);
        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdate = updatedChapters.map(ch => ({
            chapterId: ch.chapterId,
            position: updatedChapters.findIndex(item => item.chapterId === ch.chapterId)
        }));

        await patchChapterOrder(courseId, bulkUpdate);
    }, [chapters, patchChapterOrder, courseId]);

    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (active.id !== over?.id) {
            const oldIndex = chapters.findIndex(f => f.chapterId === active.id);
            const newIndex = chapters.findIndex(f => f.chapterId === over.id);
            await moveChapter(oldIndex, newIndex);
        }
    }, [chapters, moveChapter]);

    const handleSaveChapterTitle = useCallback((chapterId, newTitle) => {
        setChapters(prev => prev.map(ch =>
            ch.chapterId === chapterId ? { ...ch, chapterTitle: newTitle } : ch
        ));
    }, []);

    const onSubmit = useCallback(async (data) => {
        const newChapter = {
            chapterId: uniqid(),
            chapterTitle: data.chapterTitle,
            chapterOrder: chapters.length + 1,
            chapterContent: []
        };

        await createChapter(courseId, newChapter);
        setChapters(prev => [...prev, newChapter]);
        setIsAddingChapter(false);
        setChapterOpen(newChapter.chapterId);
        reset();
    }, [createChapter, courseId, chapters.length, reset]);

    const handleCancelAddChapter = useCallback(() => {
        setIsAddingChapter(false);
        reset();
    }, [reset]);

    return (
        <div className='bg-slate-100 w-full rounded relative'>
            <div className='flex items-center justify-between mb-4 px-6 pt-4'>
                <h3 className='font-bold text-lg'>فصل های دوره</h3>
                <button
                    type="button"
                    onClick={() => setIsAddingChapter(prev => !prev)}
                    className='text-sm inline-flex items-center gap-2 hover:text-blue-600 transition-colors'
                >
                    {isAddingChapter ? (
                        <>
                            <span>لغو</span>
                            <MinusCircle size={18} />
                        </>
                    ) : (
                        <>
                            <span>افزودن فصل</span>
                            <PlusCircle size={18} />
                        </>
                    )}
                </button>
            </div>

            {isAddingChapter ? (
                <form onSubmit={handleSubmit(onSubmit)} className='px-6 pt-2 pb-4'>
                    <div className='my-3'>
                        <input
                            disabled={isSubmitting}
                            type='text'
                            placeholder='عنوان فصل...'
                            className='form-input text-sm rounded p-2 font-Dirooz w-full'
                            {...register('chapterTitle')}
                        />
                        {errors.chapterTitle && (
                            <p className='text-[12px] text-red-500 pt-1'>{errors.chapterTitle.message}</p>
                        )}
                    </div>
                    <button
                        disabled={isSubmitting || !isValid}
                        className='btn-primary'
                        type='submit'
                    >
                        ایجاد فصل
                    </button>
                </form>
            ) : (
                <>
                    <div>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={({ active }) => setActiveId(active.id)}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={chapters?.map(f => f.chapterId)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3 max-h-[40vh] overflow-y-auto px-6 pb-4">
                                    {chapters?.map((chapter, chapterIndex) => (
                                        <CourseChapterItem
                                            key={chapter.chapterId}
                                            id={chapter.chapterId}
                                            chapter={chapter}
                                            chapterIndex={chapterIndex}
                                            chapterOpen={chapterOpen}
                                            setChapterOpen={setChapterOpen}
                                            isDragging={activeId === chapter.chapterId}
                                            courseId={courseId}
                                            onSaveChapterTitle={handleSaveChapterTitle}
                                            isEditingChapter={editingChapterId}
                                            setEditingChapterId={setEditingChapterId}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        {isReordering && (
                            <div className='absolute top-0 left-0 bg-slate-500/20 h-full w-full flex items-center justify-center text-xl'>
                                <Loader2 className='animate-spin size-8 text-sky-700' />
                            </div>
                        )}
                    </div>

                    {chapters.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            هنوز فصلی اضافه نشده است
                        </div>
                    )}
                </>
            )}
        </div>
    );
};



const CourseInputHandler = ({ inputName, ...props }) => {
    const components = {
        title: CourseTitleInput,
        description: CourseDescriptionInput,
        // isPublished: PasswordField,
        thumbnail: CourseThumbnailInput,
        price: CoursePriceInput,
        discount: CourseDiscountInput,
        chapters: CourseChapterInput


    };

    const Input = components[inputName];
    return Input ? (
        <Input {...props} />
    ) : null;
};

export default CourseInputHandler