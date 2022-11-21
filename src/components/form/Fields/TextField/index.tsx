import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@mui/material';
import { useField } from 'formik';
import React, { FC } from 'react';

interface Props{
    name:string,
    label:string,
    type:string
}

const TextFieldWrapper:FC<Props>= ({
    name,
    label,
    ...props
}) => {

    const [field, meta] = useField(name);

    const configTextField = {
        ...field,
        ...props,
        fullWidth: true,
        error: false,
        helperText: ''
    };

    /* ugly workaround, cannot add variant to configTextField because of TypeScript limitation see:
        https://github.com/microsoft/TypeScript/issues/8289
        https://github.com/mui/material-ui/issues/15697
    */
    const variant = 'outlined';

    if (meta && meta.touched && meta.error){
        configTextField.error = true;
        configTextField.helperText = meta.error;
    }

    return(
        <TextField variant={variant} label={label} {...configTextField} />
    );
};

export default TextFieldWrapper;