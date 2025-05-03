import React from 'react';

export const Input = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    error = '',
    className = '',
    disabled = false
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-1 block text-sm font-medium text-gray-700"
                >
                    {label}{' '}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full rounded-md border-2 border-gray-200 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                    (error ? 'border-red-500' : '',
                    disabled ? 'cursor-not-allowed bg-gray-100' : '')
                } ${className}`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
