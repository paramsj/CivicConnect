import React from 'react'
import MyComplaintsTable from './MyComplaintsTable'
import Header from '../components/common/Header'
const Complaints = () => {
  return (
    <div>
        <Header />
        <h1 className='text-3xl font-bold text-center mt-10'>My Complaints Page</h1>
        <MyComplaintsTable />
    </div>
  )
}

export default Complaints