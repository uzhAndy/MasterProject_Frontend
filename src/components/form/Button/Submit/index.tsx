import { Button } from '@mui/material';
import { useFormikContext } from 'formik';
import React, { FC } from 'react';

interface Props {
    children: unknown
};

const ButtonWrapper: FC<Props> = ({
    children,
    // ...props
}) => {

    const { submitForm } = useFormikContext();

    const handleSubmit = () => {
        submitForm();
    };

    const configButton = {
        fullWidth: true,
        onClick: handleSubmit
    }

    /* ugly workaround, cannot add variant to configButton because of TypeScript limitation see:
        https://github.com/microsoft/TypeScript/issues/8289
        https://github.com/mui/material-ui/issues/15697
    */
    const variant = 'contained'
    const color = 'primary'

    return (
        <Button variant={variant} color={color} {...configButton} style={{backgroundColor:'#38288f'}}>
            {children}
        </Button>
    );
};

export default ButtonWrapper;