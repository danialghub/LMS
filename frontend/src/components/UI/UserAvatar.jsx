import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'

const UserAvatar = (props) => {

    const { authUser } = useAuthStore()
    return (
                authUser?.avatar

                    ? <img
                        {...props}
                        src={authUser.avatar
                        } alt="" className='size-10  rounded-full' />

                    : <span
                        {...props}
                        className='size-10 rounded-full bg-indigo-500 text-white text-2xl flex items-center justify-center'>{authUser.name[0]}</span>

    )
}

export default UserAvatar