import React, { ChangeEvent, FC } from 'react';
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useField, useFormikContext } from 'formik';

interface Props{
    name:string,
    question:string,
    answerOptions:Record<string, string>
}

const RadioGroupWrapper: FC<Props> = ({
    name,
    question,
    answerOptions,
    ...props
}) => {

    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFieldValue(name, e.target.value)
    }

    const configRadioGroupField = {
        ...field,
        ...props,
        error: false,
        helperText: '',
        onChange: handleChange
    }

    if (meta && meta.touched && meta.error) {
        configRadioGroupField.error = true;
        configRadioGroupField.helperText = meta.error;
    }


return(
        <Box>
        <Typography variant={"body1"} gutterBottom >
            {question}
        </Typography>
        <RadioGroup name={name}>
        {
            Object.values(answerOptions).map((element, index) => {
                return(
                    <FormControlLabel
                        key={index}
                        value={element}
                        control={<Radio />}
                        label={element}
                        onChange={handleChange}

                    />

                )
            })
        }
        </RadioGroup>
        </Box>
    )

}

export default RadioGroupWrapper;