import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'

const UserAvatar = ({ className }) => {

    const { authUser } = useAuthStore()
    return (
        authUser?.avatar

            ? <img
                src={authUser.avatar}
                alt=""
                className={`size-10 object-cover rounded-full ${className}`}
             
            />

            : <span
                
                className={`size-10 rounded-full bg-indigo-500 text-white text-2xl flex items-center justify-center ${className}`}>{authUser.name[0]}</span>

    )
}

export default UserAvatar