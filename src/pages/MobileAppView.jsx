import React, { useState } from 'react';
import './MobileAppView.css';
import { db } from '../services/dbService';

// Import Modular Mobile Screen Components
import PreloaderScreen from './mobile/PreloaderScreen';
import SplashScreen from './mobile/SplashScreen';
import OnboardingScreen from './mobile/OnboardingScreen';
import LetsYouInScreen from './mobile/LetsYouInScreen';
import OtpVerifyScreen from './mobile/OtpVerifyScreen';
import NotificationOptScreen from './mobile/NotificationOptScreen';
import PreferredLangScreen from './mobile/PreferredLangScreen';
import LocationPermScreen from './mobile/LocationPermScreen';
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

export default function MobileAppView() {
  // Navigation Flow State Machine - Onboarding runs ONLY on first install/visit
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
  const [pickupLoc, setPickupLoc] = useState('Current Location');
  const [dropoffLoc, setDropoffLoc] = useState('856 Spinka Inlet Apt. 576');
  const [selectedSeat, setSelectedSeat] = useState(3);
  const [scheduledDate, setScheduledDate] = useState('Today, 09 Aug 2026');
  const [scheduledTime, setScheduledTime] = useState('3:30 PM');
  const [selectedCar, setSelectedCar] = useState(2); // Car 2 (Sedan)
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const [promoCode, setPromoCode] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  // Helper to complete onboarding & store in localStorage
  const completeOnboarding = () => {
    try {
      localStorage.setItem('taxigo_onboarded', 'true');
    } catch (e) {}
    setAppStage('APP_HOME');
  };

  // Vehicle List Data
  const vehicleList = [
    { id: 1, name: "Economy", img: "/assets/images/map/car1.png", dist: "4.5 KM", time: "15 Min", price: "$15" },
    { id: 2, name: "Sedan Comfort", img: "/assets/images/map/car2.png", dist: "4.5 KM", time: "15 Min", price: "$25" },
    { id: 3, name: "Luxury Executive", img: "/assets/images/map/car3.png", dist: "4.5 KM", time: "15 Min", price: "$35" },
    { id: 4, name: "EV Green SUV", img: "/assets/images/map/car4.png", dist: "4.5 KM", time: "15 Min", price: "$45" },
  ];

  // Dispatch Admin Notification & Save to Central DB when Ride is Requested
  const handleRequestRide = () => {
    const inquiryData = {
      customerName: phoneNumber ? ('User ' + phoneNumber.slice(-4)) : 'Mobile Passenger',
      customerPhone: phoneNumber ? ('+91 ' + phoneNumber) : '+91 9876543210',
      pickup: pickupLoc,
      dropoff: dropoffLoc,
      vehicle: selectedCar === 2 ? 'Sedan Comfort' : 'Standard Taxi',
      fare: '$25.00',
      seats: selectedSeat,
      scheduledDate,
      scheduledTime,
      status: 'Pending',
      driver: '-'
    };

    db.saveInquiry(inquiryData);

    const rideEvent = new CustomEvent('taxigo_ride_booked', {
      detail: inquiryData
    });
    window.dispatchEvent(rideEvent);

    setAppStage('RADAR');
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
      return <OnboardingScreen onFinish={() => setAppStage('LETS_YOU_IN')} />;

    case 'LETS_YOU_IN':
      return (
        <LetsYouInScreen 
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onNext={() => setAppStage('OTP_VERIFY')}
          onGoogleSignIn={(acc) => {
            setSelectedGoogleAccount(acc);
            setAppStage('ACCOUNT_DETAILS');
          }}
          onBack={() => setAppStage('ONBOARDING')}
        />
      );

    case 'ACCOUNT_DETAILS':
      return (
        <AccountDetailScreen 
          googleAccount={selectedGoogleAccount}
          onCompleteProfile={() => completeOnboarding()}
          onBack={() => setAppStage('LETS_YOU_IN')}
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
          onNext={() => setAppStage('LOCATION_PERMISSION')}
          onBack={() => setAppStage('NOTIFICATION_OPT')}
        />
      );

    case 'LOCATION_PERMISSION':
      return (
        <LocationPermScreen 
          onNext={completeOnboarding}
          onBack={() => setAppStage('PREFERRED_LANG')}
        />
      );

    case 'APP_HOME':
      return renderTabContent();

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
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          onNext={() => setAppStage('SELECT_CAR')}
          onBack={() => setAppStage('SELECT_LOCATION_LIST')}
        />
      );

    case 'SELECT_CAR':
      return (
        <SelectCarScreen 
          userCoords={userCoords}
          selectedSeat={selectedSeat}
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          vehicleList={vehicleList}
          onNext={() => setAppStage('SELECT_PAYMENT')}
          onBack={() => setAppStage('GOING_SEAT_SCHEDULE')}
        />
      );

    case 'SELECT_PAYMENT':
      return (
        <SelectPaymentScreen 
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
      return <DriverFoundScreen userCoords={userCoords} onStartRide={() => setAppStage('TRACKING')} />;

    case 'TRACKING':
      return <TripTrackingScreen userCoords={userCoords} dropoffLoc={dropoffLoc} onCompleteRide={() => setAppStage('RECEIPT')} />;

    case 'RECEIPT':
      return <TripReceiptScreen onDone={() => setAppStage('APP_HOME')} />;

    default:
      return null;
  }
}
