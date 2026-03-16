
import type {
  AddEmployeeFormData,
  AddEmployeeFormErrors,
  AddEmployeeFieldName,
} from './types';

type ValidationResult = {
  field: AddEmployeeFieldName;
  message: string;
} | null;

const isEmpty = (value: string): boolean => {
  return value.trim().length === 0;
};

const isInvalidEmail = (value: string): boolean => {
  return !/\S+@\S+\.\S+/.test(value);
};

const createRequiredValidator = (
  value: string,
  field: AddEmployeeFieldName,
  message: string
): ValidationResult => {
  return isEmpty(value) ? { field, message } : null;
};

const validateFirstName = (form: AddEmployeeFormData): ValidationResult => {
  return createRequiredValidator(
    form.firstName,
    'firstName',
    'First name is required'
  );
};

const validateLastName = (form: AddEmployeeFormData): ValidationResult => {
  return createRequiredValidator(
    form.lastName,
    'lastName',
    'Last name is required'
  );
};

const validateEmail = (form: AddEmployeeFormData): ValidationResult => {
  return !isEmpty(form.email) && isInvalidEmail(form.email)
    ? {
        field: 'email',
        message: 'Email is invalid',
      }
    : null;
};

const validateEmployeeCode = (
  form: AddEmployeeFormData
): ValidationResult => {
  return createRequiredValidator(
    form.employeeCode,
    'employeeCode',
    'Employee code is required'
  );
};

const validateDepartment = (form: AddEmployeeFormData): ValidationResult => {
  return createRequiredValidator(
    form.department,
    'department',
    'Department is required'
  );
};

const validateBranch = (form: AddEmployeeFormData): ValidationResult => {
  return createRequiredValidator(form.branch, 'branch', 'Branch is required');
};

const validatePositionTitle = (
  form: AddEmployeeFormData
): ValidationResult => {
  return createRequiredValidator(
    form.positionTitle,
    'positionTitle',
    'Position title is required'
  );
};

const validateHireDate = (form: AddEmployeeFormData): ValidationResult => {
  return createRequiredValidator(
    form.hireDate,
    'hireDate',
    'Hire date is required'
  );
};

const validators = [
  validateFirstName,
  validateLastName,
  validateEmail,
  validateEmployeeCode,
  validateDepartment,
  validateBranch,
  validatePositionTitle,
  validateHireDate,
];

const validateAddEmployeeForm = (
  form: AddEmployeeFormData
): AddEmployeeFormErrors => {
  return validators.reduce<AddEmployeeFormErrors>((errors, validator) => {
    const result = validator(form);

    if (!result) {
      return errors;
    }

    return {
      ...errors,
      [result.field]: result.message,
    };
  }, {});
};

export default validateAddEmployeeForm;
