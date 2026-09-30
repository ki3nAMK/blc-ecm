import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import 'dayjs/locale/vi';
import 'dayjs/locale/ar-sa';
import 'dayjs/locale/zh-cn';

import {
    viVN as viVNCore
} from '@mui/material/locale';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// date pickers (MUI)
import {
    viVN as viVNDate
} from '@mui/x-date-pickers/locales';
// data grid (MUI)
import {
    viVN as viVNDataGrid
} from '@mui/x-data-grid/locales';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';


// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export function LocalizationProvider({ children }: Props) {
    const fallback = {
        value: 'vi',
        label: 'Vietnamese',
        countryCode: 'VN',
        adapterLocale: 'vi',
        numberFormat: { code: 'vi-VN', currency: 'VND' },
        systemValue: {
            components: { ...viVNCore.components, ...viVNDate.components, ...viVNDataGrid.components },
        },
    };

    return (
        <Provider dateAdapter={AdapterDayjs} adapterLocale={fallback as any} >
            {children}
        </Provider>
    );
}
