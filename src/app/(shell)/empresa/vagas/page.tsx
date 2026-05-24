import { RequireEnterprise } from '@/components/RequireEnterprise'
import { EnterpriseJobsPage } from '@/views/EnterpriseJobsPage'

export default function Page() {
  return (
    <RequireEnterprise>
      <EnterpriseJobsPage />
    </RequireEnterprise>
  )
}
