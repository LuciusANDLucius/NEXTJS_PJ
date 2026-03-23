"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage(){
  const router = useRouter()

  return (
    <div className="container">
      <LoginForm onSuccess={() => router.push('/')} />
    </div>
  )
}
