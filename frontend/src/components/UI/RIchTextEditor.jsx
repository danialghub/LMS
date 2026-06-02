import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Controller } from 'react-hook-form';

const RichTextEditor = ({ control, name }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],  // این خط رو اضافه کن - دکمه‌های ترازبندی
            ['link', 'clean'],
        ],
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <ReactQuill
                
                    theme="snow"
                    value={field.value || ''}
                    onChange={field.onChange}
                    modules={modules}
                    placeholder="درباره دوره خود تعریف کنید..."
                    className="bg-white rounded-md  [&_.ql-editor]:text-right [&_.ql-editor]:font-[Vazirmatn] "
                />
            )}
        />
    );
};

export default RichTextEditor;