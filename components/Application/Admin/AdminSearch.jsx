import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { FaSearch } from "react-icons/fa";
import SearchModel from './SearchModel';


const AdminSearch = () => {
  const [open,setOpen] = useState(false);
  return (
    <div className='md:w-[350px]'>
        <div className='flex justify-between items-center relative'>
            <Input
                readOnly
                className='rounded-full'
                placeholder='Search...'
                onClick={()=>setOpen(true)}
            />
            <button type='button' className='absolute right-3 cursor-default'>
                <FaSearch/>
            </button>
            <SearchModel open={open} setOpen={setOpen}/> 
        </div>
    </div>
  )
}

export default AdminSearch