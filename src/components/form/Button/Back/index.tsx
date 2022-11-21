import { Button } from '@mui/material';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
interface Props {
    children: unknown,
    comm?: any,
};

const ButtonWrapper: FC<Props> = ({
    children,
    comm,
    // ...props
}) => {

    const navigate = useNavigate()

    const configButton = {
        fullWidth: true
    }

    /* ugly workaround, cannot add variant to configButton because of TypeScript limitation see:
    https://github.com/microsoft/TypeScript/issues/8289
    https://github.com/mui/material-ui/issues/15697
    */
    const variant = 'contained'
    const color = 'primary'
    const command = (typeof comm === 'undefined') ? () => {navigate(-1)} : comm

    return (
        <Button variant={variant} color={color} style={{ backgroundColor: "#FFFFFF", color: '#5f5f5f' }} {...configButton} onClick={command}>
            {children}
        </Button>
    );
};

export default ButtonWrapper;