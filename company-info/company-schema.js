// Modules
import * as Yup from 'yup';

export const CompanySchema = Yup.object().shape({
  state: Yup.string().required('Please select your state.'),
  country: Yup.string().required('Please select your country.'),
  keyProducts: Yup.string()
    .min(10, 'must be at least 10 characters')
    .required('Please provide a response.'),
  industrySector: Yup.string().required('Please select an industry sector.'),
  employeeAmount: Yup.string().required('Please select the number of employees.'),
  annualRevenue: Yup.string().required('Please select the current annual revenue.'),
});

export function validateInput(value) {
  let error;
  if (!value) {
    error = 'This is a required field.';
  }
  return error;
}

export function validateRadio(value) {
  let error;
  if (!value) {
    error = 'This is a required field.';
  }
  return error;
}

export function validateCheckbox(value) {
  let error;
  if (!value?.length) {
    error = 'This is a required field.';
  }
  return error;
}
