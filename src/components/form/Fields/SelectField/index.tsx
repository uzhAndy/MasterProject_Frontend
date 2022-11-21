import { MenuItem, TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import React, { ChangeEvent, FC } from 'react';

interface Props{
    name: string,
    label: string,
    options: Record<string, string>
}

const SelectWrapper: FC<Props> = ({
    name,
    label,
    options,
    ...props
}) => {

    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name)

    const handleChange = (e: ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const { value } = e.target;
        setFieldValue(name, value);
    };

    const configSelectField = {
        ...field,
        ...props,
        select: true,
        fullWidth: true,
        error: false,
        helperText: '',
        onChange: handleChange
    };

    /* ugly workaround, cannot add variant to configSelectField because of TypeScript limitation see:
        https://github.com/microsoft/TypeScript/issues/8289
        https://github.com/mui/material-ui/issues/15697
    */
    const variant = 'outlined'

    if (meta && meta.touched && meta.error) {
        configSelectField.error = true;
        configSelectField.helperText = meta.error;
    }

    return (
        <TextField 
            variant={variant}
            label={label}
            {...configSelectField}
        >
            {
                Object.keys(options).map((item: string, pos) => {
                    return (
                        <MenuItem
                            key={pos}
                            value={item}
                        >
                            {options[item]}
                        </MenuItem>
                    );
                })
            };
        </TextField>
    );
};

export default SelectWrapper;