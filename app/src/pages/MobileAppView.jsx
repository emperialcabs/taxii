import React, { useState } from 'react';
import './MobileAppView.css';
import { db } from '../services/dbService';
import { saveInquiryToFirestore, saveCustomerToFirestore } from '../services/firebaseService';
import { saveInquiryToTiDB } from '../services/tidbService';

// Import Modular Mobile Screen Components
import PreloaderScreen from './mobile/PreloaderScreen';
import SplashScreen from './mobile/SplashScreen';
import OnboardingScreen from './mobile/OnboardingScreen';
import LetsYouInScreen from './mobile/LetsYouInScreen';
import OtpVerifyScreen from './mobile/OtpVerifyScreen';
import NotificationOptScreen from './mobile/NotificationOptScreen';
import PreferredLangScreen from './mobile/PreferredLangScreen';
import LocationPermScreen from './mobile/LocationPermScreen';
import AccountCreatedScreen from './mobile/AccountCreatedScreen';
import HomeScreen from './mobile/HomeScreen';
import RidesTabScreen from './mobile/RidesTabScreen';
import WalletTabScreen from './mobile/WalletTabScreen';
import AccountTabScreen from './mobile/AccountTabScreen';
import AccountDetailScreen from './mobile/AccountDetailScreen';
import SelectLocationScreen from './mobile/SelectLocationScreen';
import SeatScheduleScreen from './mobile/SeatScheduleScreen';
import SelectCarScreen from './mobile/SelectCarScreen';
import SelectPaymentScreen from './mobile/SelectPaymentScreen';
import ProcessingScreen from './mobile/ProcessingScreen';
import DriverFoundScreen from './mobile/DriverFoundScreen';
import TripTrackingScreen from './mobile/TripTrackingScreen';
import TripReceiptScreen from './mobile/TripReceiptScreen';
import InquirySubmittedScreen from './mobile/InquirySubmittedScreen';

export default function MobileAppView() {

  // Navigation Flow State Machine
  const [appStage, setAppStage] = useState(() => {
    try {
      const hasOnboarded = localStorage.getItem('taxigo_onboarded');
      return hasOnboarded === 'true' ? 'APP_HOME' : 'PRELOADER';
    } catch (e) {
      return 'PRELOADER';
    }
  });

  // User Input & Booking States
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [selectedLang, setSelectedLang] = useState('English');
  const [userCoords, setUserCoords] = useState({ lat: 21.7645, lng: 72.1519 });
  const [pickupLoc, setPickupLoc] = useState('Bhavnagar, Gujarat');
  const [dropoffLoc, setDropoffLoc] = useState('Ahmedabad Airport (AMD)');
  const [tripType, setTripType] = useState('one-way'); // 'one-way' | 'round-trip'
  const [scheduledDate, setScheduledDate] = useState('Today, 10 Aug 2026');
  const [scheduledTime, setScheduledTime] = useState('03:30 PM');
  const [returnDate, setReturnDate] = useState('Tomorrow, 11 Aug 2026');
  const [selectedCar, setSelectedCar] = useState('CAR-101');
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const [promoCode, setPromoCode] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [lastCreatedInquiry, setLastCreatedInquiry] = useState(null);

  // Helper to complete onboarding & store in localStorage
  const completeOnboarding = () => {
    try {
      localStorage.setItem('taxigo_onboarded', 'true');
    } catch (e) { }
    setAppStage('APP_HOME');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('cabsy_user_profile');
      localStorage.removeItem('taxigo_onboarded');
    } catch (e) { }
    setSelectedGoogleAccount(null);
    setPhoneNumber('');
    setActiveTab('home');
    setAppStage('LETS_YOU_IN');
  };

  // Dispatch Admin Notification & Save to Central DB when Ride is Requested
  const handleRequestRide = (carObj) => {
    let userProf = { name: 'Dhruvil Patel', phone: '+91 98765 43210' };
    try {
      const savedProf = localStorage.getItem('cabsy_user_profile');
      if (savedProf) {
        const p = JSON.parse(savedProf);
        if (p.name) userProf.name = p.name;
        if (p.phone) userProf.phone = p.phone;
      }
    } catch (e) { }

    const selectedVehicleName = carObj?.name || 'SWIFT';
    const totalFareNum = carObj?.totalFareNum || 770;

    const newInquiryId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInquiry = {
      id: newInquiryId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: userProf.name,
      customerPhone: userProf.phone,
      pickup: pickupLoc || 'Bhavnagar, Gujarat',
      dropoff: dropoffLoc || 'Ahmedabad Airport (AMD)',
      vehicle: selectedVehicleName,
      fare: totalFareNum,
      tripType: tripType === 'round-trip' ? 'Round Trip (Return)' : 'One-Way',
      scheduledDate,
      scheduledTime,
      driver: 'Unassigned',
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    // 1. Save directly into cabsy_inquiries for Admin Portal (localStorage)
    try {
      const existingInquiries = JSON.parse(localStorage.getItem('cabsy_inquiries') || '[]');
      const updatedInquiries = [newInquiry, ...existingInquiries];
      localStorage.setItem('cabsy_inquiries', JSON.stringify(updatedInquiries));
    } catch (err) {
      console.error("Error saving inquiry to localStorage:", err);
    }

    // 2. Save into dbService for local history
    db.saveInquiry(newInquiry);

    // 3. ✅ Save to Firestore & TiDB Cloud (persists across devices & re-logins)
    saveInquiryToFirestore(newInquiry).catch(e => console.warn('Firestore inquiry save failed:', e));
    saveInquiryToTiDB(newInquiry).catch(e => console.warn('TiDB inquiry save failed:', e));

    // 4. ✅ Update customer record in Firestore with latest login/trip info
    saveCustomerToFirestore({
      name: userProf.name,
      phone: userProf.phone,
      email: userProf.email || '',
    }).catch(e => console.warn('Firestore customer save failed:', e));

    // 5. Dispatch events to notify Admin Portal in real time
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('taxigo_ride_booked', { detail: newInquiry }));

    setLastCreatedInquiry(newInquiry);
    setAppStage('INQUIRY_SUBMITTED');
  };

  // Tab Switcher Router in App Home
  const renderTabContent = () => {
    switch (activeTab) {
      case 'rides':
        return (
          <RidesTabScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBookNewRide={() => {
              setActiveTab('home');
              setAppStage('SELECT_LOCATION_LIST');
            }}
          />
        );
      case 'wallet':
        return (
          <WalletTabScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );
      case 'account':
        return (
          <AccountTabScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            onNavigateScreen={(target) => {
              if (target === 'letsyouin') setAppStage('LETS_YOU_IN');
              if (target === 'accountdetail') setAppStage('ACCOUNT_DETAILS');
              if (target === 'lang') setAppStage('PREFERRED_LANG');
              if (target === 'notification') setAppStage('NOTIFICATION_OPT');
            }}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onStartBooking={() => setAppStage('SELECT_LOCATION_LIST')}
          />
        );
    }
  };

  // Modular View Orchestrator
  switch (appStage) {
    case 'PRELOADER':
      return <PreloaderScreen onFinish={() => setAppStage('SPLASH')} />;

    case 'SPLASH':
      return <SplashScreen onNext={() => setAppStage('ONBOARDING')} />;

    case 'ONBOARDING':
      return <OnboardingScreen onSkip={() => setAppStage('LETS_YOU_IN')} onFinish={() => setAppStage('LETS_YOU_IN')} />;

    case 'LETS_YOU_IN':
      return (
        <LetsYouInScreen
          selectedGoogleAccount={selectedGoogleAccount}
          setSelectedGoogleAccount={setSelectedGoogleAccount}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onNext={() => setAppStage('OTP_VERIFY')}
          onGoogleSignIn={(acc) => {
            if (acc) setSelectedGoogleAccount(acc);
            completeOnboarding();
          }}
          onBack={() => setAppStage('ONBOARDING')}
        />
      );

    case 'OTP_VERIFY':
      return (
        <OtpVerifyScreen
          phoneNumber={phoneNumber}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          onNext={() => setAppStage('NOTIFICATION_OPT')}
          onBack={() => setAppStage('LETS_YOU_IN')}
        />
      );

    case 'NOTIFICATION_OPT':
      return (
        <NotificationOptScreen
          onNext={() => setAppStage('PREFERRED_LANG')}
          onBack={() => setAppStage('OTP_VERIFY')}
        />
      );

    case 'PREFERRED_LANG':
      return (
        <PreferredLangScreen
          selectedLang={selectedLang}
          setSelectedLang={setSelectedLang}
          onNext={() => setAppStage('LOCATION_PERM')}
          onBack={() => setAppStage('NOTIFICATION_OPT')}
        />
      );

    case 'LOCATION_PERM':
      return (
        <LocationPermScreen
          onNext={() => setAppStage('ACCOUNT_CREATED')}
          onBack={() => setAppStage('PREFERRED_LANG')}
        />
      );

    case 'ACCOUNT_CREATED':
      return (
        <AccountCreatedScreen
          onNext={() => completeOnboarding()}
          onBack={() => setAppStage('LOCATION_PERM')}
        />
      );

    case 'APP_HOME':
      return renderTabContent();

    case 'ACCOUNT_DETAILS':
      return <AccountDetailScreen onBack={() => setAppStage('APP_HOME')} onSave={() => setAppStage('APP_HOME')} />;

    case 'SELECT_LOCATION_LIST':
      return (
        <SelectLocationScreen
          pickupLoc={pickupLoc}
          setPickupLoc={setPickupLoc}
          dropoffLoc={dropoffLoc}
          setDropoffLoc={setDropoffLoc}
          onSelectLocation={() => setAppStage('GOING_SEAT_SCHEDULE')}
          onBack={() => setAppStage('APP_HOME')}
        />
      );

    case 'GOING_SEAT_SCHEDULE':
      return (
        <SeatScheduleScreen
          userCoords={userCoords}
          pickupLoc={pickupLoc}
          dropoffLoc={dropoffLoc}
          tripType={tripType}
          setTripType={setTripType}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          onNext={(carObj) => handleRequestRide(carObj)}
          onBack={() => setAppStage('SELECT_LOCATION_LIST')}
        />
      );

    case 'SELECT_CAR':
      return (
        <SelectCarScreen
          userCoords={userCoords}
          pickupLoc={pickupLoc}
          dropoffLoc={dropoffLoc}
          tripType={tripType}
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          onNext={(carObj) => handleRequestRide(carObj)}
          onBack={() => setAppStage('GOING_SEAT_SCHEDULE')}
        />
      );

    case 'INQUIRY_SUBMITTED':
      return (
        <InquirySubmittedScreen
          inquiry={lastCreatedInquiry}
          onGoHome={() => setAppStage('APP_HOME')}
          onViewRides={() => {
            setActiveTab('rides');
            setAppStage('APP_HOME');
          }}
        />
      );

    case 'SELECT_PAYMENT':
      return (
        <SelectPaymentScreen
          userCoords={userCoords}
          pickupLoc={pickupLoc}
          dropoffLoc={dropoffLoc}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          onRequestRide={handleRequestRide}
          onBack={() => setAppStage('SELECT_CAR')}
        />
      );

    case 'RADAR':
      return (
        <ProcessingScreen
          onCancel={() => setAppStage('SELECT_PAYMENT')}
          onMatched={() => setAppStage('MATCHED')}
        />
      );

    case 'MATCHED':
      return (
        <DriverFoundScreen
          userCoords={userCoords}
          pickupLoc={pickupLoc}
          dropoffLoc={dropoffLoc}
          onStartRide={() => setAppStage('TRACKING')}
        />
      );

    case 'TRACKING':
      return (
        <TripTrackingScreen
          userCoords={userCoords}
          pickupLoc={pickupLoc}
          dropoffLoc={dropoffLoc}
          onCompleteRide={() => setAppStage('RECEIPT')}
        />
      );

    case 'RECEIPT':
      return <TripReceiptScreen onDone={() => setAppStage('APP_HOME')} />;

    default:
      return null;
  }
}
