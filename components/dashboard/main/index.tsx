/*eslint-disable*/
'use client';

import MainChart from '@/components/dashboard/main/cards/MainChart';
import DashboardLayout from '@/components/layout';
import { SupabaseUser } from '@/types';
import tableDataUserReports from '@/variables/tableDataUserReports';
interface Props {
  user: SupabaseUser | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

export default function Settings(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Subscription Page"
      description="Manage your subscriptions"
    >
      <div className="h-full w-full">
        <div className="mb-5 flex gap-5 flex-col xl:flex-row w-full">
          <MainChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
