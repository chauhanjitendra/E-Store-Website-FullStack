import React from 'react'
import UserPanelNavigation from './UserPanelNavigation'

const UserPanelLayout = ({ children }) => {
  return (
    <div className='flex flex-wrap lg:flex-nowrap gap-5 lg:gap-10 lg:px-32 px-4 my-5 lg:my-20'>
      <div className='lg:w-64 w-full lg:mb-0 mb-2'>
        <UserPanelNavigation />
      </div>
      <div className='lg:w-[calc(100%-16rem)] w-full'>
        {children}
      </div>
    </div>
  )
}

export default UserPanelLayout