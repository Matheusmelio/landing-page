import { Suspense } from 'react'
import { CoursePurchasePage } from '@/views/CoursePurchasePage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CoursePurchasePage />
    </Suspense>
  )
}
