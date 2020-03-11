import React from 'react';
import { STATUS } from '../../lib/constants';

interface FiltersProps {
    filters: any;
    onSelect: (filter: string, checked: boolean) => void;
}

function Filters({
    filters,
    onSelect,
}: FiltersProps) {

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelect(e.target.value, e.target.checked);
    };

    return (
        <>
            <div className='form-group'>
                {Object.entries(STATUS).map(([key, status]) => (
                    <div className='form-check' key={status.value}>
                        <input
                            className='form-check-input'
                            type='checkbox'
                            name='task_status'
                            value={status.value}
                            id={`r_${status.value}`}
                            checked={filters[status.value]}
                            onChange={onChange}
                        />
                        <label className='form-check-label' htmlFor={`r_${status.value}`}>{status.text}</label>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Filters;