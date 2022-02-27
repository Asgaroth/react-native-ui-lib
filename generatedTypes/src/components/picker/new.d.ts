import React, { PropsWithChildren } from 'react';
import { ForwardRefInjectedProps, BaseComponentInjectedProps } from '../../commons/new';
import { PickerProps, PickerValue, PickerModes, PickerSearchStyle } from './types';
declare const Picker: {
    (props: PropsWithChildren<PickerProps> & ForwardRefInjectedProps & BaseComponentInjectedProps): JSX.Element;
    Item: any;
    defaultProps: any;
    modes: {
        SINGLE: string;
        MULTI: string;
    };
    extractPickerItems(props: PropsWithChildren<PickerProps>): {
        value: any;
        label: any;
    }[] | null | undefined;
};
export { PickerProps, PickerValue, PickerModes, PickerSearchStyle };
export { Picker };
declare const _default: React.ComponentClass<{
    useCustomTheme?: boolean | undefined;
}, any>;
export default _default;
