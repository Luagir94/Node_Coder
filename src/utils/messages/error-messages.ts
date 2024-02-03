const requiredField = (field: string) => `${field} es requerido`

const minLength = (field: string, length: number) => `${field} debe tener al menos ${length} caracteres`

const maxLength = (field: string, length: number) => `${field} debe tener como máximo ${length} caracteres`

const invalidEmail = (field: string) => `${field} debe ser un email válido`

const invalidFormat = (field: string, format: string) => `${field} debe ser en formato ${format}`

const minValue = (field: string) => `${field} debe ser mayor a 0`

export const errorMessages = {
    requiredField,
    minLength,
    maxLength,
    invalidEmail,
    invalidFormat,
    minValue,
}
