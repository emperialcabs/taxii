// Empire Cab Mobile User Experience & Navigation Engine v1.0.8
import React, { useState, useEffect } from 'react';
import './MobileAppView.css';
import { db } from '../services/dbService';
import { saveInquiryToMySQL, saveCustomerToMySQL } from '../services/mysqlService';
import { notifyAdmin } from '../services/notificationEngine';

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
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [authEmail, setAuthEmail] = useState('');
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

  // Ensure appStage remains on APP_HOME so live ride renders directly on the Home Screen map
  useEffect(() => {
    const syncActiveRideStage = () => {
      try {
        const savedInquiries = localStorage.getItem('cabsy_inquiries');
        if (savedInquiries) {
          const list = JSON.parse(savedInquiries);
          const activeRide = list.find(i => i.status === 'In Progress' || i.status === 'On Ride' || i.status === 'Confirmed');
          if (activeRide && appStage !== 'APP_HOME') {
            setAppStage('APP_HOME');
          }
        }
      } catch (e) {}
    };

    syncActiveRideStage();

    window.addEventListener('storage', syncActiveRideStage);
    window.addEventListener('taxigo_trip_started', syncActiveRideStage);
    window.addEventListener('taxigo_db_sync', syncActiveRideStage);
    return () => {
      window.removeEventListener('storage', syncActiveRideStage);
      window.removeEventListener('taxigo_trip_started', syncActiveRideStage);
      window.removeEventListener('taxigo_db_sync', syncActiveRideStage);
    };
  }, []);

  // Helper to complete onboarding & store in localStorage
  const completeOnboarding = () => {
    try {
      localStorage.setItem('taxigo_onboarded', 'true');
      localStorage.setItem('taxigo_profile_completed', 'true');
      const existing = localStorage.getItem('cabsy_user_profile');
      if (!existing) {
        const defaultProfile = {
          name: 'Empire Rider',
          phone: phoneNumber || localStorage.getItem('cabsy_user_phone') || '+91 98765 43210',
          email: authEmail || localStorage.getItem('cabsy_user_email_otp_target') || '',
          totalRides: 0,
          totalSpent: 0
        };
        localStorage.setItem('cabsy_user_profile', JSON.stringify(defaultProfile));
      }
    } catch (e) { }
    setAppStage('APP_HOME');
  };

  // Skip profile setup for returning users (2nd+ time login)
  const proceedAfterAuth = () => {
    try {
      const isCompleted = localStorage.getItem('taxigo_profile_completed') === 'true';
      const saved = localStorage.getItem('cabsy_user_profile');
      if (isCompleted || (saved && JSON.parse(saved).name)) {
        completeOnboarding();
        return;
      }
    } catch (e) {}
    setAppStage('CREATE_PROFILE');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('cabsy_user_profile');
      localStorage.removeItem('taxigo_onboarded');
      localStorage.removeItem('taxigo_profile_completed');
    } catch (e) { }
    setSelectedGoogleAccount(null);
    setPhoneNumber('');
    setActiveTab('home');
    setAppStage('LETS_YOU_IN');
  };

  // Dispatch Admin Notification & Save to Central DB when Ride is Requested
  const handleRequestRide = (carObj) => {
    try {
      const savedInquiries = localStorage.getItem('cabsy_inquiries');
      if (savedInquiries) {
        const list = JSON.parse(savedInquiries);
        const ongoing = list.find(i => i.status === 'Confirmed' || i.status === 'In Progress' || i.status === 'On Ride');
        if (ongoing) {
          alert(`You currently have an active ride (${ongoing.status}) heading to ${ongoing.dropoff}. Cannot book a second ride while a trip is active!`);
          setAppStage('TRACKING');
          return;
        }
      }
    } catch (e) {}

    let userProf = { name: 'Rider', phone: '+91 98765 43210', email: 'spiderman757506@gmail.com' };
    try {
      const savedProf = localStorage.getItem('cabsy_user_profile');
      if (savedProf) {
        const p = JSON.parse(savedProf);
        if (p.name) userProf.name = p.name;
        if (p.phone) userProf.phone = p.phone;
        if (p.email) userProf.email = p.email;
      }
    } catch (e) { }

    const selectedVehicleName = carObj?.name || 'SWIFT';
    const totalFareNum = carObj?.totalFareNum || 770;

    const newInquiryId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const walletDiscountUsed = carObj?.walletDiscountUsed || 0;
    const originalFare = carObj?.originalFare || totalFareNum;
    const couponUsed = carObj?.couponUsed || (walletDiscountUsed > 0 ? `Wallet Reward (-₹${walletDiscountUsed})` : null);

    const newInquiry = {
      id: newInquiryId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName: userProf.name,
      customerPhone: userProf.phone,
      customerEmail: userProf.email || '',
      pickup: pickupLoc || 'Bhavnagar, Gujarat',
      dropoff: dropoffLoc || 'Ahmedabad Airport (AMD)',
      vehicle: selectedVehicleName,
      fare: totalFareNum,
      originalFare,
      walletDiscountUsed,
      couponUsed,
      tripType: tripType === 'round-trip' ? 'Round Trip (Return)' : 'One-Way',
      scheduledDate,
      scheduledTime,
      driver: 'Unassigned',
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    if (walletDiscountUsed > 0) {
      db.deductWalletBalance(userProf.phone, walletDiscountUsed, newInquiryId);
    }

    // 1. Save into dbService (single source of truth for localStorage inquiries)
    db.saveInquiry(newInquiry);

    // 2. Trigger System Push & Admin Bell Notification
    notifyAdmin({
      type: 'inquiry',
      title: `🚖 New Ride Inquiry ${newInquiryId}`,
      body: `Customer ${userProf.name} requested ${newInquiry.pickup} → ${newInquiry.dropoff} (₹${totalFareNum})`,
      extraData: { inquiryId: newInquiryId }
    });

    // 3. Save directly to Hostinger MySQL Database
    saveInquiryToMySQL(newInquiry).catch(e => console.warn('MySQL inquiry save failed:', e));
    saveCustomerToMySQL(userProf).catch(e => console.warn('MySQL customer save failed:', e));

    // 5. Dispatch events to notify Admin Portal in real time
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('taxigo_ride_booked', { detail: newInquiry }));

    setLastCreatedInquiry(newInquiry);
    setAppStage('INQUIRY_SUBMITTED');
  };

  // Tab Switcher Router in App Home - Persistent GPU-Accelerated Tab Mounting (Zero Blink / 60FPS)
  useEffect(() => {
    if (activeTab === 'home') {
      // Trigger map resize event when home tab becomes active to prevent Leaflet map blink
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const renderTabContent = () => {
    return (
      <div className="mobile-tabs-keep-alive-wrapper" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: activeTab === 'home' ? 1 : 0, visibility: activeTab === 'home' ? 'visible' : 'hidden', pointerEvents: activeTab === 'home' ? 'auto' : 'none', transform: activeTab === 'home' ? 'translate3d(0,0,0)' : 'translate3d(0,6px,0)', transition: 'opacity 0.22s cubic-bezier(0.16,1,0.3,1), transform 0.22s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column' }}>
          <HomeScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onStartBooking={() => setAppStage('SELECT_LOCATION_LIST')}
            onOpenTracking={() => setAppStage('TRACKING')}
          />
        </div>

        <div style={{ position: 'absolute', inset: 0, opacity: activeTab === 'rides' ? 1 : 0, visibility: activeTab === 'rides' ? 'visible' : 'hidden', pointerEvents: activeTab === 'rides' ? 'auto' : 'none', transform: activeTab === 'rides' ? 'translate3d(0,0,0)' : 'translate3d(0,6px,0)', transition: 'opacity 0.22s cubic-bezier(0.16,1,0.3,1), transform 0.22s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column' }}>
          <RidesTabScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBookNewRide={() => {
              setActiveTab('home');
              setAppStage('SELECT_LOCATION_LIST');
            }}
          />
        </div>

        <div style={{ position: 'absolute', inset: 0, opacity: activeTab === 'wallet' ? 1 : 0, visibility: activeTab === 'wallet' ? 'visible' : 'hidden', pointerEvents: activeTab === 'wallet' ? 'auto' : 'none', transform: activeTab === 'wallet' ? 'translate3d(0,0,0)' : 'translate3d(0,6px,0)', transition: 'opacity 0.22s cubic-bezier(0.16,1,0.3,1), transform 0.22s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column' }}>
          <WalletTabScreen
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div style={{ position: 'absolute', inset: 0, opacity: activeTab === 'account' ? 1 : 0, visibility: activeTab === 'account' ? 'visible' : 'hidden', pointerEvents: activeTab === 'account' ? 'auto' : 'none', transform: activeTab === 'account' ? 'translate3d(0,0,0)' : 'translate3d(0,6px,0)', transition: 'opacity 0.22s cubic-bezier(0.16,1,0.3,1), transform 0.22s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column' }}>
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
        </div>
      </div>
    );
  };

  // Modular View Orchestrator — wrapped in a fixed-height root container
  // so that all child screens with height:100% resolve correctly on iOS/Android
  const renderStage = () => { switch (appStage) {
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
          setAuthMethod={setAuthMethod}
          setAuthEmail={setAuthEmail}
          onNext={() => setAppStage('OTP_VERIFY')}
          onGoToCreateAccount={() => setAppStage('CREATE_PROFILE')}
          onGoogleSignIn={(acc) => {
            if (acc) setSelectedGoogleAccount(acc);
            // LetsYouInScreen already checked Firestore:
            // - Returning user: profile_completed=true → go to APP_HOME
            // - New user: goes to CREATE_PROFILE via onGoToCreateAccount
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
          authMethod={authMethod}
          authEmail={authEmail}
          onNext={() => proceedAfterAuth()}
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
          onNext={() => setAppStage('CREATE_PROFILE')}
          onBack={() => setAppStage('PREFERRED_LANG')}
        />
      );

    case 'CREATE_PROFILE':
      return (
        <AccountDetailScreen
          isCreateMode={true}
          googleData={selectedGoogleAccount}
          onBack={() => setAppStage('LOCATION_PERM')}
          onSave={(updatedProfile) => {
            if (updatedProfile) {
              saveCustomerToMySQL(updatedProfile).catch(() => {});
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new CustomEvent('taxigo_db_sync', { detail: { type: 'CUSTOMER_UPDATED', data: updatedProfile } }));
            }
            setAppStage('ACCOUNT_CREATED');
          }}
        />
      );

    case 'ACCOUNT_CREATED':
      return (
        <AccountCreatedScreen
          onNext={() => completeOnboarding()}
          onBack={() => completeOnboarding()}
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setAppStage('APP_HOME');
          }}
          onCompleteRide={() => setAppStage('RECEIPT')}
        />
      );

    case 'RECEIPT':
      return <TripReceiptScreen onDone={() => setAppStage('APP_HOME')} />;

    default:
      return renderTabContent();
  } };

  return (
    <div
      id="taxigo-app-root"
      style={{
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        background: '#F8FAFC'
      }}
    >
      {renderStage()}
    </div>
  );
}
