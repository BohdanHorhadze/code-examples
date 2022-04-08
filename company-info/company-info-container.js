// Modules
import { useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Actions
import companyInfoAsyncActions from 'Engine/event-registration-company-info/async-actions';

// Constants
import NOTIFICATION_MESSAGES from 'Constants/notification-messages';
import { STATIC_PAGES } from 'Constants/pages';
import STEP_NUMBERS from 'Constants/stepNumbers';

// Components
import CompanyInfo from './company-info';

// Helpers
import { getAllElements } from 'Helpers/get-all-elements';
import { getDynamicInitialValues } from 'Helpers/get-dynamic-initial-values';
import { saveByConditionCompletedTab } from 'Helpers/store-helper';
import { transformValuesToFormData } from 'Helpers/transform-values-to-formdata';
import { transformBody } from 'Helpers/transform-body';

// Hooks
import useNavigateToMeetingsScreen from 'Hooks/routes/use-navigate-to-meetings-screen';
import useNavigateToContactInfoScreen from 'Hooks/routes/use-navigate-to-contact-info-screen';
import useNavigateToProjectNeedsScreen from 'Hooks/routes/use-navigate-to-project-needs-screen';
import useNavigateToPrimaryScreen from 'Hooks/routes/use-navigate-to-primary-screen';
import useNotificationService from 'Hooks/notification-service/use-notification-service';

// Selectors
import contactInfoSelectors from 'Engine/event-registration-company-info/selectors';
import eventSelectors from 'Engine/event/selectors';
import headerSelectors from 'Engine/header/selectors';
import userSelectors from 'Engine/user/selectors';

function CompanyInfoContainer() {
  const dispatch = useDispatch();
  const goToMeetingsScreen = useNavigateToMeetingsScreen();
  const goToContactInfoScreen = useNavigateToContactInfoScreen();
  const goToProjectNeedsScreen = useNavigateToProjectNeedsScreen();
  const goToPrimaryScreen = useNavigateToPrimaryScreen();
  const { showSuccessNotification, showErrorNotification } = useNotificationService();

  const currentCompletedTab = useSelector(headerSelectors.completedTab);
  const staticPage = useSelector(eventSelectors.currentStaticPage(STATIC_PAGES.COMPANY_INFO));
  const userEmail = useSelector(userSelectors.email);
  const event = useSelector(eventSelectors.event);
  const companyInfo = useSelector(contactInfoSelectors.companyInfo);

  const allElements = useMemo(() => getAllElements(staticPage), [staticPage]);
  const dynamicInitialValues = useMemo(
    () => getDynamicInitialValues(allElements, companyInfo),
    [allElements, companyInfo],
  );
  const isVirtualEvent = event?.isVirtual;
  const eventId = event.id;
  const currentIndexPage = STEP_NUMBERS.COMPANY_INFO;

  const initialValues = useMemo(
    () => ({
      state: companyInfo.state || '',
      country: companyInfo.country || '',
      industrySector: companyInfo.industrySector || '',
      keyProducts: companyInfo.keyProducts || '',
      employeeAmount: companyInfo.employeeAmount || '',
      annualRevenue: companyInfo.annualRevenue || '',
      ...dynamicInitialValues,
    }),
    [companyInfo, dynamicInitialValues],
  );

  const handleSubmit = useCallback(
    (values) => {
      const formData = transformValuesToFormData(values);

      const body = transformBody({
        email: userEmail,
        eventId,
        formData,
        isSave: false,
      });

      dispatch(companyInfoAsyncActions.submitCompanyInfo(body))
        .unwrap()
        .then(() => {
          saveByConditionCompletedTab(dispatch, currentCompletedTab, currentIndexPage);
          showSuccessNotification(NOTIFICATION_MESSAGES.submitted);
          if (isVirtualEvent) {
            goToMeetingsScreen();
          } else {
            // TODO: add request to keep meatings data
            goToProjectNeedsScreen();
          }
        })
        .catch(() => showErrorNotification(NOTIFICATION_MESSAGES.cantSubmitted));
    },
    [
      currentCompletedTab,
      currentIndexPage,
      dispatch,
      eventId,
      goToMeetingsScreen,
      goToProjectNeedsScreen,
      isVirtualEvent,
      showErrorNotification,
      showSuccessNotification,
      userEmail,
    ],
  );

  const handleSave = useCallback(
    (values) => {
      const formData = transformValuesToFormData(values);
      const body = transformBody({
        eventId: eventId,
        email: userEmail,
        formData,
        isSave: true,
      });

      dispatch(companyInfoAsyncActions.submitCompanyInfo(body))
        .unwrap()
        .then(() => showSuccessNotification(NOTIFICATION_MESSAGES.saved))
        .catch(() => showErrorNotification(NOTIFICATION_MESSAGES.cantSaved));
    },
    [
      eventId,
      dispatch,
      userEmail,
      showSuccessNotification,
      showErrorNotification,
    ],
  );

  useEffect(() => {
    dispatch(
      companyInfoAsyncActions.getCompanyInfoData(
        transformBody({
          eventId,
          email: userEmail,
        }),
      ),
    );
  }, [currentIndexPage, dispatch, eventId, userEmail]);

  useEffect(() => {
    goToPrimaryScreen(currentIndexPage);
  }, [currentIndexPage, goToPrimaryScreen]);

  return (
    <div>
      <CompanyInfo
        allElements={allElements}
        handleGoBack={goToContactInfoScreen}
        handleSave={handleSave}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
      />
    </div>
  );
}

export default CompanyInfoContainer;
