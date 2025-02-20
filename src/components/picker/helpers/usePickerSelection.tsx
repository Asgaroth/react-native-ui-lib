import {RefObject, useCallback, useState} from 'react';
import _ from 'lodash';
import {PickerProps, PickerValue, PickerSingleValue, PickerMultiValue} from '../types';

interface UsePickerSelectionProps
  extends Pick<PickerProps, 'migrate' | 'value' | 'onChange' | 'getItemValue' | 'topBarProps'> {
  pickerExpandableRef: RefObject<any>;
  setSearchValue: (searchValue: string) => void;
}

const usePickerSelection = (props: UsePickerSelectionProps) => {
  const {migrate, value, onChange, topBarProps, pickerExpandableRef, getItemValue, setSearchValue} = props;
  const [multiDraftValue, setMultiDraftValue] = useState(value as PickerMultiValue);
  const [multiFinalValue, setMultiFinalValue] = useState(value as PickerMultiValue);

  const onDoneSelecting = useCallback((item: PickerValue) => {
    setSearchValue('');
    setMultiFinalValue(item as PickerMultiValue);
    pickerExpandableRef.current?.closeExpandable?.();
    onChange?.(item);
  },
  [onChange]);

  const toggleItemSelection = useCallback((item: PickerSingleValue) => {
    let newValue;
    const itemAsArray = [item];
    if (!migrate) {
      newValue = _.xorBy(multiDraftValue, itemAsArray, getItemValue || 'value');
    } else {
      newValue = _.xor(multiDraftValue, itemAsArray);
    }

    setMultiDraftValue(newValue);
  },
  [multiDraftValue, getItemValue]);

  const cancelSelect = useCallback(() => {
    setSearchValue('');
    setMultiDraftValue(multiFinalValue);
    pickerExpandableRef.current?.closeExpandable?.();
    topBarProps?.onCancel?.();
  }, [multiFinalValue, topBarProps]);

  return {
    multiDraftValue,
    onDoneSelecting,
    toggleItemSelection,
    cancelSelect
  };
};

export default usePickerSelection;
