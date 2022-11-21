import React, { FC } from 'react';
import { Chip, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface Props{
    name:string,
    label:string,
}

const MultiValueTextFieldWrapper:FC<Props> = ({
    name,
    label,
    ...props
}) => {

    return (
        <Autocomplete
            multiple={true}
            options={[]}
            freeSolo
            // onChange={(e, value) => setFieldValue(name, value?.id || "")}
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip 
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                    />
                ))
              }
              renderInput={(params) => ( 
                    <TextField
                        {...params}
                        variant='outlined'
                        label={label}
                        name={name}
                    />
              )}
            />
        
)};

export default MultiValueTextFieldWrapper;