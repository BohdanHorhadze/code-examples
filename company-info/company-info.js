// Modules
import { memo, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Formik, Field, Form, ErrorMessage } from 'formik';

// Assets
import LeftArrow from 'Assets/svg/left-arrow';
import BackArrow from 'Assets/svg/back-arrow';

// Components
import { ButtonDefault } from 'quartz-network-ui';
import QuestionComponent from 'Components/question/question-component';
import RadioButtonComponent from 'Components/radio-button/radio-button-component';
import CheckboxComponent from 'Components/checkbox/checkbox-component';
import SelectComponent from 'Components/select';

// Constants
import { companyOptions } from './company-options';
import ELEMENT_TYPES from 'Constants/element-types';

// Schema
import { CompanySchema, validateInput, validateRadio, validateCheckbox } from './company-schema';

const maxCharacters = 70;

function CompanyInfo(props) {
  const {
    allElements,
    handleGoBack,
    handleSave,
    handleSubmit,
    initialValues,
  } = props;

  return (
    <>
      <WrapperCompanyInfo>
        <CompanyTitle>Company Info</CompanyTitle>
        <CompanySubText>
          {' '}
          This information helps us curate your experience and maximize the value you receive from
          the event.
        </CompanySubText>
        <SubTitle>Location</SubTitle>
      </WrapperCompanyInfo>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={CompanySchema}
      >
        {(formikProps) => (
          <Form onSubmit={formikProps.handleSubmit}>
            <WrapperCompanyInfo>
              <ItemContainer>
                <InputLabel>What country are you located in?</InputLabel>
                <Field
                  as={SelectComponent}
                  name="country"
                  onChange={(option) => {
                    formikProps.setFieldValue('country', option.value);
                  }}
                  options={companyOptions.groupedCountries}
                  placeholder="Select"
                  value={formikProps.values.country}
                />
                <ErrorMessage component={ErrorMessageText} name="country" />
              </ItemContainer>
              <ItemContainer>
                <InputLabel>What state is your company headquarted in?</InputLabel>
                <Field
                  as={SelectComponent}
                  name="state"
                  onChange={(option) => {
                    formikProps.setFieldValue('state', option.value);
                  }}
                  options={companyOptions.states}
                  placeholder="Select"
                  value={formikProps.values.state}
                />
                <ErrorMessage component={ErrorMessageText} name="state" />
              </ItemContainer>
              <ItemContainer>
                <InputLabel>Which industry sector best describes your business?</InputLabel>
                <Field
                  as={SelectComponent}
                  name="industrySector"
                  onChange={(option) => {
                    formikProps.setFieldValue('industrySector', option.value);
                  }}
                  options={companyOptions.industrySector}
                  placeholder="Select"
                  value={formikProps.values.industrySector}
                />
                <ErrorMessage component={ErrorMessageText} name="industrySector" />
              </ItemContainer>
              <ItemContainer>
                <LabelContainer>
                  <InputLabel>
                    What are the key products and services offered by your company?
                  </InputLabel>
                  <Characters>10-70 Characters</Characters>
                </LabelContainer>
                <Field name="keyProducts">
                  {({ field }) => (
                    <TextArea
                      type="text"
                      {...field}
                      onChange={(event) => {
                        if (maxCharacters < event.target.value.length) {
                          return;
                        }
                        field.onChange(event);
                      }}
                    />
                  )}
                </Field>
                <Characters>{`Characters left: ${maxCharacters - formikProps?.values?.keyProducts.length}`}</Characters>
                <ErrorMessage component={ErrorMessageText} name="keyProducts" />
              </ItemContainer>
              <ItemContainer>
                <InputLabel>How many people are employed by your company?</InputLabel>
                <Field
                  as={SelectComponent}
                  name="employeeAmount"
                  onChange={(option) => {
                    formikProps.setFieldValue('employeeAmount', option.value);
                  }}
                  options={companyOptions.employeeAmount}
                  placeholder="Select"
                  value={formikProps.values.employeeAmount}
                />
                <ErrorMessage component={ErrorMessageText} name="employeeAmount" />
              </ItemContainer>
              <ItemContainer>
                <InputLabel>What is the current annual revenue for your organization?</InputLabel>
                <Field
                  as={SelectComponent}
                  name="annualRevenue"
                  onChange={(option) => {
                    formikProps.setFieldValue('annualRevenue', option.value);
                  }}
                  options={companyOptions.annualRevenue}
                  placeholder="Select"
                  value={formikProps.values.annualRevenue}
                />
                <ErrorMessage component={ErrorMessageText} name="annualRevenue" />
              </ItemContainer>
              {parseFieldsArray(allElements, formikProps)}
            </WrapperCompanyInfo>
            <FooterContainer>
              <FooterContent>
                <Button
                  variant="tertiary"
                  type="button"
                  onClick={() => {
                    handleSave(formikProps.values);
                  }}
                >
                  <ButtonText>Save</ButtonText>
                </Button>
                <div>
                  <ButtonLeft variant="tertiary" type="button" onClick={handleGoBack}>
                    <BackArrow />
                    <ButtonText>Back</ButtonText>
                  </ButtonLeft>
                  <Button variant="primary" type="submit">
                    <ButtonText>Next</ButtonText>
                    <LeftArrow />
                  </Button>
                </div>
              </FooterContent>
            </FooterContainer>
          </Form>
        )}
      </Formik>
    </>
  );
}

function parseFieldsArray(fields, formikProps) {
  return fields?.map((el) => {
    switch (el.type) {
      case ELEMENT_TYPES.radio:
        return createRadio(el, formikProps);
      case ELEMENT_TYPES.input:
        return createInput(el, formikProps);
      case ELEMENT_TYPES.checkbox:
        return createCheckbox(el, formikProps);
      default:
        return null;
    }
  });
}

function createRadio(el, formikProps) {
  return (
    <ItemContainer key={el.id}>
      <QuestionComponent content={el.question} />
      <RadioGroup>
        {el.options.map((option, index) => {
          return (
            <Fragment key={`${el.id}_${option}`}>
              <Field
                as={RadioButtonComponent}
                checked={formikProps.values[el.id] === option}
                id={`${el.id}_${index}`}
                name={el.id}
                onChange={formikProps.handleChange}
                value={option}
                validate={validateRadio}
              />
            </Fragment>
          );
        })}
        {el.required && <ErrorMessage component={ErrorMessageText} name={el.id} />}
      </RadioGroup>
    </ItemContainer>
  );
}

function createInput(el, formikProps) {
  return (
    <ItemContainer key={el.id}>
      <QuestionComponent content={el.question} />
      <Field
        as={Input}
        validate={validateInput}
        placeholder={el.placeholder ? el.placeholder : ''}
        onChange={formikProps.handleChange}
        name={el.id}
      />
      {el.required && <ErrorMessage component={ErrorMessageText} name={el.id} />}
    </ItemContainer>
  );
}

function createCheckbox(el, formikProps) {
  return (
    <ItemContainer key={el.id}>
      <QuestionComponent content={el.question} />
      <CheckboxAreaContainer>
        {el.options.map((option, index) => (
          <Fragment key={`${el.id}_${option}`}>
            <Field
              as={CheckboxComponent}
              checked={formikProps.values[el.id].includes(option)}
              id={`${el.id}_${index}`}
              key={`${el.id}_${index}`}
              name={el.id}
              onChange={(e) => {
                formikProps.setFieldTouched(el.id, true);
                formikProps.handleChange(e);
              }}
              validate={validateCheckbox}
              value={option}
            />
          </Fragment>
        ))}
        {el.required && <ErrorMessage component={ErrorMessageText} name={el.id} />}
      </CheckboxAreaContainer>
    </ItemContainer>
  );
}

const RadioGroup = styled.div`
  display: flex;
  height: 48px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  & div:first-child {
    border-left: 1px solid #c7c7c7;
    border-radius: 4px 0 0 4px;
  }
  & div:last-child {
    border-radius: 0 4px 4px 0;
  }
`;

const WrapperCompanyInfo = styled.div`
  width: 684px;
  margin: 0 auto;
`;

const CompanyTitle = styled.h1`
  color: #172a58;
  font-size: 30px;
  font-style: normal;
  font-weight: 800;
  margin: 60px 0px 24px;
`;

const CompanySubText = styled.p`
  color: #5c5c5c;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  margin: 0px 0px 40px;
`;

const SubTitle = styled.h3`
  border-bottom: 1px solid #d8d8d8;
  color: #161616;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 0px;
  padding-bottom: 8px;
  width: 100%;
`;

const ErrorMessageText = styled.p`
  margin: 0;
  padding-top: 10px;
  color: red;
  position: absolute;
  bottom: -20px;
`;

const Input = styled.input.attrs({
  type: 'text',
})`
  background: #ffffff;
  border: 1px solid #c7c7c7;
  box-sizing: border-box;
  border-radius: 4px;
  color: #161616;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  height: 48px;
  line-height: 24px;
  padding: 12px 24px;
  width: 100%;
  &:focus-visible {
    border: 1px solid #6f97f6;
    box-shadow: 0px 0px 0px 1px #6f97f6;
    outline: none;
  }
`;

const InputLabel = styled.label`
  color: #5c5c5c;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 35px;
  margin-bottom: 8px;
`;

const TextArea = styled.textarea`
  border: 1px solid #c7c7c7;
  border-radius: 4px;
  font-family: 'Proxima Nova', sans-serif;
  font-size: 16px;
  height: 170px;
  line-height: 24px;
  padding: 5px;
  resize: none;
  text-indent: 16px;
  width: 98%;
  &:focus-visible {
    border: 1px solid #6f97f6;
    box-shadow: 0px 0px 0px 1px #6f97f6;
    outline: none;
  }
`;

const Characters = styled.div`
  color: #9b9b9b;
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  font-size: 12px;
  line-height: 18px;
  margin-right: 5px;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
`;

const ItemContainer = styled.div`
  width: 100%;
  margin-top: 24px;
  position: relative;
`;

const CheckboxAreaContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
  width: 684px;
`;

const FooterContainer = styled.div`
  align-items: center;
  border-top: 1px solid #d8d8d8;
  display: flex;
  flex: 0 0 auto;
  height: 67px;
  justify-content: center;
  margin-top: 100px;
  width: 100%;
`;

const FooterContent = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: auto;
  max-width: 684px;
  width: 100%;
`;

const Button = styled(ButtonDefault)`
  margin: 0;
  min-width: 109px;
  padding: 7px 18px;
  svg {
    margin-left: 6px;
  }
`;

const ButtonLeft = styled(Button)`
  margin-right: 24px;
  svg {
    margin-left: 0px;
    margin-right: 6px;
  }
`;

const ButtonText = styled.p`
  padding: 0;
  margin: 0;
`;

CompanyInfo.propTypes = {
  allElements: PropTypes.arrayOf(
    PropTypes.shape({
      order: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      help: PropTypes.bool.isRequired,
      placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null]), PropTypes.bool]),
      required: PropTypes.bool.isRequired,
      validation: PropTypes.bool.isRequired,
      ranking: PropTypes.bool,
      options: PropTypes.array,
      visible: PropTypes.bool.isRequired,
      visibilityCondition: PropTypes.oneOf([null, PropTypes.bool]),
    }),
  ),
  header: PropTypes.arrayOf(
    PropTypes.shape({
      order: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      question: PropTypes.string.isRequired,
      help: PropTypes.bool.isRequired,
      placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null]), PropTypes.bool]),
      required: PropTypes.bool.isRequired,
      validation: PropTypes.bool.isRequired,
      ranking: PropTypes.bool,
      options: PropTypes.array,
      visible: PropTypes.bool.isRequired,
      visibilityCondition: PropTypes.oneOf([null, PropTypes.bool]),
    }),
  ),
};

export default memo(CompanyInfo);
