import React, { useState } from 'react'
import { Edit, File, Plus, UploadCloud, VideoIcon, XIcon } from 'lucide-react'
import {
    lectureTitleSchema, isLecureFreeSchema, lectureUrlSchema, attachmentSchema
} from '@/validators/courseSchema'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCourseStore } from '../../store/useCourseStore'
import { VideoPlayer } from '@/components/index'

const LectureTitleInput = ({ courseId, chapterId, lectureId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { patchLectureFields } = useCourseStore()
    const [displayValue, setDisplayValue] = useState(value || "")
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm(
        {
            resolver: zodResolver(lectureTitleSchema),
            values: { lectureTitle: displayValue },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchLectureFields(courseId, chapterId, lectureId, data)
        setIsEditing(false)
    }
    const toggleEdit = () => {
        if (isEditing) {
            setDisplayValue(value)
        }
        setIsEditing(prev => !prev)
    }
    return (
        <div className='w-full py-3 sm:py-4 px-4 sm:px-6 bg-slate-100 rounded-md'>
            <div className='flex items-center justify-between gap-2'>
                <h3 className='font-bold text-base sm:text-lg'>عنوان جلسه</h3>
                <button
                    className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-1.5 sm:p-2 duration-150 cursor-pointer shrink-0'
                    onClick={toggleEdit}>
                    {isEditing ? <XIcon size={18} /> : <Edit size={18} />}
                </button>
            </div>

            <div>
                {isEditing
                    ? <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='my-3'>
                            <input
                                disabled={isSubmitting}
                                type='text'
                                className='form-input text-sm rounded p-2 w-full'
                                {...register('lectureTitle', {
                                    onChange: (e) => setDisplayValue(e.target.value)
                                })}
                            />
                            <p className='text-[12px] text-red-500 pt-1'>{errors.lectureTitle?.message}</p>
                        </div>
                        <button
                            disabled={isSubmitting || !isValid || value === displayValue}
                            className='btn-primary w-auto'
                            type='submit'>
                            ذخیره
                        </button>
                    </form>
                    : <h4 className='text-black/70 text-sm mt-3 p-2 break-words'>{displayValue}</h4>
                }
            </div>
        </div>
    )
}

const LectureVideoInput = ({ courseId, chapterId, lectureId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value || "")
    const [videoUrl, setVideoUrl] = useState(value || "")


    const { patchLectureFields, progressBar } = useCourseStore()
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        resolver: zodResolver(lectureUrlSchema),
        values: { lectureUrl: undefined },
        mode: "onChange"
    });

    const toggleEdit = () => {
        setIsEditing(prev => !prev)
        reset()
        if (isEditing) {
            setDisplayValue(videoUrl)
        } else {
            setDisplayValue('')
        }

    }



    const getVideoDuration = (file) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video")
            video.preload = "metadata"
            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src)
                resolve(video.duration / 60)
            }
            video.onerror = reject
            video.src = URL.createObjectURL(file)
        })
    }

    const onSubmit = async (data) => {
        if (!data.lectureUrl) return

        const form = new FormData()
        form.append("file", data.lectureUrl)

        const newVideoUrl = URL.createObjectURL(data.lectureUrl)
        const durationInMinutes = await getVideoDuration(data.lectureUrl)
        form.append("lectureDuration", durationInMinutes)

        await patchLectureFields(courseId, chapterId, lectureId, form)

        setVideoUrl(newVideoUrl)
        setDisplayValue(newVideoUrl)
        reset({ lectureUrl: undefined })
        setIsEditing(false)

    }

    const changeVideo = () => {
        reset()
        setDisplayValue('')

    }

    return (
        <div className='w-full bg-slate-100 rounded-md mb-6 px-4 sm:px-6 pt-4'>
            <div className='flex items-center justify-between gap-2'>
                <h3 className='font-bold text-base sm:text-lg'>ویدئو جلسه</h3>
                <button
                    className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-1.5 sm:p-2 duration-150 cursor-pointer shrink-0'
                    onClick={toggleEdit}>
                    {isEditing ? <XIcon size={18} /> : videoUrl ? <Edit size={18} /> : <Plus size={18} />}
                </button>
            </div>

            <div>
                {isEditing ? (
                    <div className='py-4'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='my-3 border-2 border-slate-200 rounded-md relative'>
                                {displayValue ? (
                                    <div className='relative'>
                                        <VideoPlayer
                                            video={{ src: displayValue, thumbnail: "/course1.png" }}
                                            className='aspect-video w-full rounded'
                                            alt=""
                                        />
                                        <button
                                            onClick={changeVideo}
                                            className='size-6 sm:size-7 absolute cursor-pointer top-2 left-2 z-10 text-white bg-black/50 rounded-full flex items-center justify-center'
                                            type="button"
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className='aspect-video flex flex-col items-center justify-center text-black/70 cursor-pointer w-full'>
                                        <Controller
                                            name="lectureUrl"
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="video/*"
                                                    onBlur={onBlur}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setDisplayValue(URL.createObjectURL(file));
                                                            onChange(file);
                                                        }
                                                    }}
                                                    ref={ref}
                                                />
                                            )}
                                        />
                                        <div className='flex flex-col justify-center items-center gap-2 text-black/70 p-4 text-center'>
                                            <UploadCloud size={32} className='cursor-pointer' />
                                            <p className='text-xs sm:text-sm'>حداکثر 100 مگابایت</p>
                                            <p className='text-xs text-gray-500'>فرمت‌های مجاز: MP4, AVI, MKV</p>
                                        </div>
                                    </label>
                                )}
                                <p className='text-[12px] text-red-500 pt-1'>{errors.lectureUrl?.message}</p>
                            </div>
                            <button
                                disabled={isSubmitting || !isValid}
                                type='submit'
                                className='relative overflow-hidden btn-primary w-auto px-4 sm:px-6 py-1'
                            >
                                {/* لایه پیشرفت (پس‌زمینه متحرک) */}
                                {isSubmitting && (
                                    <div
                                        className='absolute inset-0 bg-blue-500 transition-all duration-300 ease-out'
                                        style={{ width: `${progressBar}%` }}
                                    />
                                )}

                                {/* متن و درصد وسط دکمه */}
                                <span className='relative z-10 flex items-center gap-2'>
                                    {isSubmitting ? (
                                        <>
                                            <span>{progressBar}%</span>
                                            <span className='hidden sm:inline'>در حال آپلود...</span>
                                        </>
                                    ) : (
                                        'آپلود ویدئو'
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className='mb-6 mt-3 bg-slate-200 rounded overflow-hidden'>
                        {videoUrl ? (
                            <VideoPlayer
                                video={{ src: videoUrl, thumbnail: "/course1.png" }}
                                className='aspect-video w-full'
                                alt=""
                            />
                        ) : (
                            <div className='aspect-video flex flex-col items-center justify-center text-black/70'>
                                <VideoIcon size={32} />
                                <p className='text-sm mt-2'>بدون ویدئو</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

const LectureAccessSettingInput = ({ courseId, chapterId, lectureId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value)
    const { patchLectureFields } = useCourseStore()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm(
        {
            resolver: zodResolver(isLecureFreeSchema),
            values: { isLectureFree: value || false },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchLectureFields(courseId, chapterId, lectureId, data)
        setDisplayValue(data.isLectureFree)
        setIsEditing(false)
    }

    return (
        <div className='w-full py-3 sm:py-4 px-4 sm:px-6 bg-slate-100 rounded-md'>
            <div className='flex items-center justify-between gap-2'>
                <h3 className='font-bold text-base sm:text-lg'>وضعیت مشاهده جلسه</h3>
                <button
                    className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-1.5 sm:p-2 duration-150 cursor-pointer shrink-0'
                    onClick={() => setIsEditing(prev => !prev)}>
                    {isEditing ? <XIcon size={18} /> : <Edit size={18} />}
                </button>
            </div>

            <div>
                {isEditing
                    ? <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='my-4 sm:my-5'>
                            <label className='flex items-start sm:items-center gap-2'>
                                <input
                                    disabled={isSubmitting}
                                    type='checkbox'
                                    className='text-sm size-4 sm:size-5 accent-blue-500 mt-1 sm:mt-0 shrink-0'
                                    {...register('isLectureFree')}
                                />
                                <p className='text-xs sm:text-sm text-black/70 leading-relaxed'>
                                    اگر میخواهید این جلسه برای دانشجویان رایگان باشد تیک بزنید
                                </p>
                            </label>
                            <p className='text-[12px] text-red-500 pt-1'>{errors.isLectureFree?.message}</p>
                        </div>
                        <button
                            disabled={isSubmitting || !isValid || displayValue === watch('isLectureFree')}
                            className='btn-primary w-auto'
                            type='submit'>
                            ذخیره
                        </button>
                    </form>
                    : <div className='mt-3 p-2'>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm ${watch('isLectureFree')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {watch('isLectureFree')
                                ? "✓ جلسه رایگان"
                                : "🔒 جلسه نیاز به خرید دارد"
                            }
                        </span>
                    </div>
                }
            </div>
        </div>
    )
}

const LectureAttachmentInput = ({ courseId, chapterId, lectureId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value || null)


    const { patchLectureFields, removeAttachment, progressBar } = useCourseStore()
    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm({
        resolver: zodResolver(attachmentSchema),
        values: { attachment: null },
        mode: "onChange"
    });

    const toggleEdit = () => {
        setIsEditing(prev => !prev)
        reset()
        if (isEditing) {
            setDisplayValue(value)
        }

    }

    const onSubmit = async (data) => {
        if (!data.attachment) return

        const form = new FormData()
        form.append("file", data.attachment)

        await patchLectureFields(courseId, chapterId, lectureId, form)
        setDisplayValue(data.attachment)
        reset({ attachment: null })
        setIsEditing(false)

    }

    const removeAttachmentHandler = async () => {
        if (watch('attachment')) {
            reset()
            setDisplayValue(null)
        } else {
            await removeAttachment(courseId, chapterId, lectureId)
            setDisplayValue(null)
        }
        setIsEditing(false)

    }

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className='w-full bg-slate-100 rounded-md mb-6 px-4 sm:px-6 py-4'>
            <div className='flex items-center justify-between gap-2'>
                <h3 className='font-bold text-base sm:text-lg'>پیوست جلسه</h3>
                <button
                    className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-1.5 sm:p-2 duration-150 cursor-pointer shrink-0'
                    onClick={toggleEdit}>
                    {isEditing ? <XIcon size={18} /> : displayValue?.name ? <Edit size={18} /> : <Plus size={18} />}
                </button>
            </div>

            <div>
                {isEditing ? (
                    <div className='py-4'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='my-3 relative'>
                                {displayValue?.name ? (
                                    <div dir='ltr' className='flex flex-row items-center gap-2 rounded-md bg-blue-100 text-blue-800 p-3'>
                                        <div className='flex items-center gap-2 flex-1 w-full'>
                                            <File size={20} className='shrink-0' />
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-xs sm:text-sm truncate'>{displayValue.name}</p>
                                                <p className='text-xs text-blue-600 mt-1'>
                                                    {formatFileSize(displayValue.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type='button'
                                            onClick={removeAttachmentHandler}
                                            className='p-1.5 hover:bg-blue-200 rounded-full transition-colors shrink-0'
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className='min-h-[150px] sm:min-h-[200px] flex flex-col items-center justify-center cursor-pointer text-black/70 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 transition-colors'>
                                        <Controller
                                            name="attachment"
                                            control={control}
                                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                                <input
                                                    type="file"
                                                    hidden
                                                    onBlur={onBlur}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setDisplayValue(file);
                                                            onChange(file);
                                                        }
                                                    }}
                                                    ref={ref}
                                                />
                                            )}
                                        />
                                        <div className='flex flex-col justify-center items-center gap-2 text-black/70 p-4 text-center'>
                                            <UploadCloud size={32} className='cursor-pointer' />
                                            <p className='text-xs sm:text-sm'>حداکثر 10 مگابایت</p>
                                            <p className='text-xs text-gray-500'>فرمت‌های مجاز: PDF, ZIP, DOC, و...</p>
                                        </div>
                                    </label>
                                )}
                                <p className='text-[12px] text-red-500 pt-1'>{errors.attachment?.message}</p>
                            </div>
                            <button
                                disabled={isSubmitting || !isValid}
                                className='btn-primary w-auto px-4 sm:px-6 py-1'
                                type='submit'>
                                آپلود
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className='mt-3'>
                        {displayValue?.name ? (
                            <div dir='ltr' className='flex items-center gap-2 rounded-md bg-blue-100 text-blue-800 p-3'>
                                <File size={18} className='shrink-0' />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-xs sm:text-sm truncate'>{displayValue.name}</p>
                                    {displayValue.size && (
                                        <p className='text-xs text-blue-600 mt-1'>
                                            {formatFileSize(displayValue.size)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className='text-black/60 text-sm p-3 bg-slate-200 rounded-md text-center'>
                                <p>بدون فایل پیوست</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

const LectureInputHandler = ({ inputName, ...props }) => {
    const components = {
        title: LectureTitleInput,
        video: LectureVideoInput,
        accessSetting: LectureAccessSettingInput,
        attachment: LectureAttachmentInput,
    }

    const Input = components[inputName]
    return Input ? <Input {...props} /> : null
}

export default LectureInputHandler