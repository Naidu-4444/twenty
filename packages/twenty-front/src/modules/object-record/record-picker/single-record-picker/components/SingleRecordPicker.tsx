import { useRef } from 'react';

import {
  SingleRecordPickerMenuItemsWithSearch,
  SingleRecordPickerMenuItemsWithSearchProps,
} from '@/object-record/record-picker/single-record-picker/components/SingleRecordPickerMenuItemsWithSearch';
import { SingleRecordPickerComponentInstanceContext } from '@/object-record/record-picker/single-record-picker/states/contexts/SingleRecordPickerComponentInstanceContext';
import { singleRecordPickerSearchFilterComponentState } from '@/object-record/record-picker/single-record-picker/states/singleRecordPickerSearchFilterComponentState';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { useSetRecoilComponentStateV2 } from '@/ui/utilities/state/component-state/hooks/useSetRecoilComponentStateV2';

export const SINGLE_RECORD_PICKER_LISTENER_ID = 'single-record-select';

export type SingleRecordPickerProps = {
  componentInstanceId: string;
  dropdownWidth?: number;
} & SingleRecordPickerMenuItemsWithSearchProps;

export const SingleRecordPicker = ({
  EmptyIcon,
  emptyLabel,
  excludedRecordIds,
  onCancel,
  onCreate,
  onRecordSelected,
  objectNameSingular,
  componentInstanceId,
  layoutDirection,
  dropdownWidth,
}: SingleRecordPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const setRecordPickerSearchFilter = useSetRecoilComponentStateV2(
    singleRecordPickerSearchFilterComponentState,
    componentInstanceId,
  );

  const handleCancel = () => {
    setRecordPickerSearchFilter('');

    onCancel?.();
  };

  const handleCreateNew = (searchInput?: string | undefined) => {
    onCreate?.(searchInput);

    setRecordPickerSearchFilter('');
  };

  useListenClickOutside({
    refs: [containerRef],
    callback: (event) => {
      event.stopImmediatePropagation();

      const weAreNotInAnHTMLInput = !(
        event.target instanceof HTMLInputElement &&
        event.target.tagName === 'INPUT'
      );

      if (weAreNotInAnHTMLInput) {
        handleCancel();
      }
    },
    listenerId: SINGLE_RECORD_PICKER_LISTENER_ID,
  });

  return (
    <SingleRecordPickerComponentInstanceContext.Provider
      value={{ instanceId: componentInstanceId }}
    >
      <DropdownContent ref={containerRef} widthInPixels={dropdownWidth}>
        <SingleRecordPickerMenuItemsWithSearch
          {...{
            EmptyIcon,
            emptyLabel,
            excludedRecordIds,
            onCancel: handleCancel,
            onCreate: handleCreateNew,
            onRecordSelected,
            objectNameSingular,
            layoutDirection,
          }}
        />
      </DropdownContent>
    </SingleRecordPickerComponentInstanceContext.Provider>
  );
};
