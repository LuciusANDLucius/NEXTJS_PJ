"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage(){
  const router = useRouter()

  return (
    <div className="container">
      <RegisterForm onSuccess={() => router.push('/login')} />
    </div>
  )
}
