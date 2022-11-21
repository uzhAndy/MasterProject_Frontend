import { Button } from '@mui/material';
import React, { FC } from 'react';

interface Props {
    children: string,
    command: Function,
    vari?: string,
    disabled?: boolean,
    startIcon?: any,
    fontColor?: string,
    backgroundColor?: string
};

const ButtonWrapper: FC<Props> = ({
    children,
    command,
    vari,
    disabled,
    startIcon,
    fontColor,
    backgroundColor
    // ...props
}) => {

    const configButton = {
        fullWidth: true,
    }

    /* ugly workaround, cannot add variant to configButton because of TypeScript limitation see:
    https://github.com/microsoft/TypeScript/issues/8289
    https://github.com/mui/material-ui/issues/15697
    */

    const variant = (typeof vari === 'undefined') ? "contained" : "text";
    const color = 'primary';
    const disable = (typeof disabled === 'undefined') ? false : disabled;
    const icon = (typeof startIcon === 'undefined') ? null : startIcon;
    const buttonBackGroundColor = (typeof backgroundColor === 'undefined') ? '#38288f' : backgroundColor
    const buttonFontGroundColor = (typeof fontColor === 'undefined') ? '#FFFFFF' : fontColor

    // alert(fontColor)


    return (
        <Button variant={variant}
            
            style={{ backgroundColor: buttonBackGroundColor, color: buttonFontGroundColor }}
            disabled={disable}
            startIcon={icon}
            onClick={() => { command() }}
            {...configButton}
        >
            <>
                {children}
            </>
        </Button>
    );
};

export default ButtonWrapper;