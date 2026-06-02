import React, { useEffect, useState } from 'react'
import { Edit, File, Image, ImageIcon, MinusCircle, Plus, PlusCircle, UploadCloud, VideoIcon, XIcon } from 'lucide-react'
import {
    lectureTitleSchema, isLecureFreeSchema, lectureUrlSchema, attachmentSchema
} from '@/validators/courseSchema'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCourseStore } from '../../store/useCourseStore'
import { VideoPlayer } from '@/components/index'

import { chapterContent } from '../../validators/courseSchema'

const LectureTitleInput = ({ courseId, chapterId, lectureId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { patchLectureFields } = useCourseStore()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm(
        {
            resolver: zodResolver(lectureTitleSchema),
            values: { lectureTitle: value || "" },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchLectureFields(courseId, chapterId, lectureId, data)

        setIsEditing(false)

    }
    return (
        <div className='w-full py-4 px-6 bg-slate-100 rounded-md '>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-lg'>عنوان جلسه</h3>
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
                                type='text' className='form-input text-sm rounded p-2 ' {...register('lectureTitle')} />
                            <p className='text-[12px] text-red-500 pt-1'>{errors.courseTitle?.message}</p>
                        </div>
                        <button
                            disabled={isSubmitting || !isValid}
                            className='btn-primary' type='submit'>ذخیره</button>
                    </form >
                    : <h4 className='text-black/70 text-sm mt-3 p-2'>{watch('lectureTitle')}</h4>

                }
            </div>
        </div>
    )
}


const LectureVideoInput = ({ courseId, chapterId, lectureId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value || "")
    const [videoUrl, setVideoUrl] = useState(value || "")

    const { patchLectureFields } = useCourseStore()
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
            setDisplayValue(videoUrl) // Reset to saved video URL
        } else {
            setDisplayValue('')
        }
    }

    const onSubmit = async (data) => {
        if (!data.lectureUrl) return

        const form = new FormData()
        form.append("file", data.lectureUrl)


        const newVideoUrl = URL.createObjectURL(data.lectureUrl);

        const durationInMinutes = await new Promise((resolve, reject) => {
            const video = document.createElement("video");

            video.preload = "metadata";

            video.onloadedmetadata = () => {
                URL.revokeObjectURL(video.src);
                resolve(video.duration / 60);
            };

            video.onerror = reject;

            video.src = newVideoUrl;
        });
        
        form.append("lectureDuration", durationInMinutes);
        await patchLectureFields(courseId, chapterId, lectureId, form)

        setVideoUrl(newVideoUrl)
        setDisplayValue(newVideoUrl)
        reset({ lectureUrl: undefined })
        setIsEditing(false)

    }

    const changeThumb = () => {
        reset()
        setDisplayValue('')
    }

    return (
        <div className='w-full bg-slate-100 rounded-md mb-6 px-6 pt-4'>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-lg'>ویدئو جلسه</h3>
                <div>
                    <button
                        className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-2 duration-150 cursor-pointer'
                        onClick={toggleEdit}>
                        {isEditing ? <XIcon /> : videoUrl ? <Edit /> : <Plus />}
                    </button>
                </div>
            </div>

            <div>
                {isEditing ? (
                    <div className='py-4'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='my-3 border-2 border-slate-200 rounded-md relative'>
                                {displayValue ? (
                                    <div>
                                        <VideoPlayer
                                            video={{ src: displayValue, thumbnail: "/course1.png" }}
                                            className='aspect-video transform-cpu'
                                            alt=""
                                        />
                                        <button
                                            onClick={changeThumb}
                                            className='size-7 absolute cursor-pointer top-2 left-2 z-10 text-white'
                                            type="button"
                                        >
                                            <XIcon />
                                        </button>
                                    </div>
                                ) : (
                                    <label className='aspect-video flex flex-col items-center justify-center text-black/70 cursor-pointer'>
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
                                        <div className='flex flex-col justify-center items-center gap-2 text-black/70'>
                                            <UploadCloud size={40} className='cursor-pointer' />
                                            <p className='text-sm'>حداکثر 256 مگابایت</p>
                                        </div>
                                    </label>
                                )}
                                <p className='text-[12px] text-red-500 pt-1'>{errors.lectureUrl?.message}</p>
                            </div>
                            <button
                                disabled={isSubmitting || !isValid}
                                className='btn-primary mx-auto px-6 py-1'
                                type='submit'
                            >
                                آپلود
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className='mb-6 mt-3 bg-slate-200'>
                        {videoUrl ? (
                            <VideoPlayer
                                video={{ src: videoUrl, thumbnail: "/course1.png" }}
                                className='aspect-video'
                                alt=""
                            />
                        ) : (
                            <div className='aspect-video flex flex-col items-center justify-center text-black/70'>
                                <VideoIcon size={40} />
                                <p>بدون ویدئو</p>
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
            values: { isLectureFree: value || "" },
            mode: "onChange"
        }
    )

    const onSubmit = async (data) => {
        await patchLectureFields(courseId, chapterId, lectureId, data)
        setDisplayValue(data.isLectureFree)
        setIsEditing(false)

    }
    return (
        <div className='w-full py-4 px-6 bg-slate-100 rounded-md '>
            <div className='flex items-center justify-between'>
                <h3 className='font-bold text-lg'>  وضعیت مشاهده جلسه</h3>
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
                        <div className='my-5'>
                            <label className='flex items-center gap-2'>
                                <input
                                    disabled={isSubmitting}
                                    type='checkbox'
                                    className=' text-sm  size-5 accent-blue-500 ' {...register('isLectureFree')}
                                />
                                <p className='text-sm text-black/70'>اگر میخواهید این جلسه برای دانشجویان رایگان باشد تیک بزنید</p>
                            </label>
                            <p className='text-[12px] text-red-500 pt-1'>{errors.isLectureFree?.message}</p>
                        </div>
                        <button
                            disabled={isSubmitting || !isValid || displayValue === watch('isLectureFree')}
                            className='btn-primary' type='submit'>ذخیره</button>
                    </form >
                    : <h4 className='text-black/70 text-sm mt-3 p-2'>
                        {watch('isLectureFree')
                            ? " این جلسه رایگان برای دانشجویان است"
                            : "این جلسه نیاز به خرید توسط دانشجویان دارد"

                        }
                    </h4>

                }
            </div>
        </div>
    )
}


const LectureAttachmentInput = ({ courseId, chapterId, lectureId, value }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [displayValue, setDisplayValue] = useState(value || {})

    const { patchLectureFields, removeAttachment } = useCourseStore()
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

        // ریست کردن فرم با مقدار خالی برای فایل

        setIsEditing(false)
    }

    const removeAttachmentHandler = async () => {
        if (watch('attachment')) {
            reset()
            setDisplayValue('')

        } else {
            await removeAttachment(courseId, chapterId, lectureId)
        }
        setIsEditing(false)
    }

    return (
        <div className='w-full bg-slate-100 rounded-md mb-6 px-6 py-4'>
            <div className='flex items-center justify-between   '>
                <h3 className='font-bold text-lg'>پیوست جلسه</h3>
                <div>
                    <button
                        className='hover:bg-blue-100 rounded-full hover:text-blue-800 p-2 duration-150 cursor-pointer '
                        onClick={toggleEdit}>

                        {isEditing ? <XIcon /> : displayValue?.name ? <Edit /> : <Plus />}
                    </button>
                </div>
            </div>

            <div>
                {isEditing
                    ?
                    <div className=' py-4   '>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='my-3  relative'>
                                {displayValue?.name
                                    ? <div dir='ltr'
                                        className='flex items-end gap-1 rounded-md bg-blue-100 text-blue-800 p-3'>
                                        <File />
                                        <p className='text-sm w-1/2 truncate'>{displayValue.name}</p>
                                        <button
                                            type='button'
                                            onClick={removeAttachmentHandler}
                                            className='size-7 absolute cursor-pointer top-2 right-2 z-10  '><XIcon /></button>
                                    </div>
                                    :
                                    <label className='aspect-video  flex items-center justify-center cursor-pointer text-black/70'>
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
                                                        console.log(file);

                                                        setDisplayValue(file);
                                                        onChange(file)
                                                    }}
                                                    ref={ref}
                                                />
                                            )}
                                        />
                                        <div className='flex flex-col justify-center items-center gap-2 text-black/70'>
                                            <UploadCloud size={40} className='cursor-pointer' />
                                            <p className='text-sm'>حداکثر 10 مگابایت</p>
                                        </div>
                                    </label>

                                }

                                <p className='text-[12px] text-red-500 pt-1'>{errors.attachment?.message}</p>
                            </div>
                            <button
                                disabled={isSubmitting || !isValid}
                                className='btn-primary mx-auto px-6 py-1' type='submit'>آپلود</button>
                        </form >
                    </div>
                    : <div className=' mt-3  '>
                        {displayValue?.name
                            ? <div dir='ltr'
                                className='flex items-end gap-1 rounded-md bg-blue-100 text-blue-800 p-3'>
                                <File />
                                <p className='text-sm w-1/2 truncate'>{displayValue.name}</p>

                            </div>
                            : <div className=' text-black/60 text-sm'>

                                <p>بدون فایل پیوست</p>
                            </div>

                        }
                    </div>

                }
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


    };

    const Input = components[inputName];
    return Input ? (
        <Input {...props} />
    ) : null;
};

export default LectureInputHandler