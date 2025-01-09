"use client";

import { updateOrderStatus } from '@/app/dashboard/orders/[id]/actions';
import { ChevronDownIcon } from '@/components/ui/icon';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select';

const statuses = [{ label: 'New', value: 'New' }, { label: 'Paid', value: 'Paid' }, { label: 'Shipped', value: 'Shipped' }, { label: 'Delivered', value: 'Delivered' }];
export default function StatusSelector({ status, id }: { status: string; id: number; }) {
  return (
    <Select className='ml-auto w-48' defaultValue={status} onValueChange={(value) => updateOrderStatus(id, value)}>
      <SelectTrigger variant="outline" size="md">
        <SelectInput placeholder="Select status" />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {statuses.map((status) => (
            <SelectItem key={status.value} label={status.label} value={status.value} />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
