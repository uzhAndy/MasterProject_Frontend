import { TextField } from '@material-ui/core';
import { useField } from 'formik';
import React, { FC } from 'react';

interface Props {
    name: string,
    label: string,
}

const DateTimePicker: FC<Props> = ({
    name,
    label,
    ...otherProps
}) => {
    const [field, meta] = useField(name);

    const configDateTimePicker = {
        ...field,
        ...otherProps,
        fullWidth: true,
        InputLabelProps: {
            shrink: true
        },
        error: false,
        helperText: ''
    };

    const type = 'date'
    const variant = 'outlined'

    if (meta && meta.touched && meta.error) {
        configDateTimePicker.error = true;
        configDateTimePicker.helperText = meta.error;
    }

    return (
        <TextField type={type} variant={variant} label={label} {...configDateTimePicker}
        />
    );
};

export default DateTimePicker;