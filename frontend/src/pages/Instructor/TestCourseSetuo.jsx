// import React, { useEffect } from "react";
// import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { courseSchema, CourseFormData } from "./types";

// // این تابع درخواست PATCH را برای یک فیلد خاص ارسال می‌کند
// async function updateCourseField<T>(
//   courseId: string,
//   fieldPath: string, // مثل "title" یا "chapters.0.title"
//   value: T
// ) {
//   const response = await fetch(`/api/courses/${courseId}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ [fieldPath]: value }),
//   });
//   if (!response.ok) throw new Error("خطا در ذخیره‌سازی");
//   return response.json();
// }

// interface Props {
//   initialData: CourseFormData;
//   courseId: string;
// }

// export default function CourseEditor({ initialData, courseId }: Props) {
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors, isDirty, isValid },
//     watch,
//     setValue,
//     trigger,
//   } = useForm<CourseFormData>({
//     resolver: zodResolver(courseSchema),
//     defaultValues: initialData,
//     mode: "onBlur", // اعتبارسنجی هنگام خروج از فیلد
//   });

//   // مدیریت آرایه فصل‌ها
//   const {
//     fields: chapterFields,
//     append: appendChapter,
//     remove: removeChapter,
//   } = useFieldArray({
//     control,
//     name: "chapters",
//   });

//   // تابع کمکی برای به‌روزرسانی خودکار هر فیلد (روی Blur)
//   const onFieldBlur = async (
//     e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
//     fieldPath: string
//   ) => {
//     // ابتدا اعتبارسنجی فیلد (trigger) انجام می‌شود
//     const isValidField = await trigger(fieldPath as any);
//     if (!isValidField) return;

//     const newValue = e.target.value;
//     try {
//       await updateCourseField(courseId, fieldPath, newValue);
//       console.log(`فیلد ${fieldPath} با موفقیت به‌روز شد`);
//     } catch (error) {
//       console.error("خطا در ذخیره:", error);
//       // می‌توانید پیام خطا را به کاربر نشان دهید
//     }
//   };

//   // برای فیلدهای عددی (price, discount) از onChange استفاده می‌کنیم
//   const onNumberFieldChange = async (
//     value: number,
//     fieldPath: string
//   ) => {
//     const isValidField = await trigger(fieldPath as any);
//     if (!isValidField) return;
//     try {
//       await updateCourseField(courseId, fieldPath, value);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <form>
//       {/* فیلد title */}
//       <div>
//         <label>عنوان دوره</label>
//         <input
//           {...register("title")}
//           onBlur={(e) => onFieldBlur(e, "title")}
//         />
//         {errors.title && <span>{errors.title.message}</span>}
//       </div>

//       {/* فیلد description (textarea) */}
//       <div>
//         <label>توضیحات</label>
//         <textarea
//           {...register("description")}
//           onBlur={(e) => onFieldBlur(e, "description")}
//         />
//         {errors.description && <span>{errors.description.message}</span>}
//       </div>

//       {/* فیلد price (عدد) */}
//       <div>
//         <label>قیمت</label>
//         <input
//           type="number"
//           {...register("price", { valueAsNumber: true })}
//           onBlur={(e) =>
//             onNumberFieldChange(e.target.valueAsNumber, "price")
//           }
//         />
//         {errors.price && <span>{errors.price.message}</span>}
//       </div>

//       {/* فیلد discount (اختیاری) */}
//       <div>
//         <label>تخفیف (۰ تا ۱۰۰)</label>
//         <input
//           type="number"
//           {...register("discount", { valueAsNumber: true })}
//           onBlur={(e) =>
//             onNumberFieldChange(e.target.valueAsNumber, "discount")
//           }
//         />
//         {errors.discount && <span>{errors.discount.message}</span>}
//       </div>

//       {/* فیلدهای attachment و image (لینک) */}
//       <div>
//         <label>پیوست (لینک)</label>
//         <input
//           {...register("attachment")}
//           onBlur={(e) => onFieldBlur(e, "attachment")}
//         />
//       </div>
//       <div>
//         <label>آدرس تصویر</label>
//         <input
//           {...register("image")}
//           onBlur={(e) => onFieldBlur(e, "image")}
//         />
//       </div>

//       {/* بخش فصل‌ها */}
//       <h3>فصل‌ها</h3>
      