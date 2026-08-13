import { saveInquiryToFirestore } from '../../services/firebaseService';
import { saveInquiryToTiDB, loadAllInquiriesFromTiDB } from '../../services/tidbService';

export default function RidesTabScreen({ activeTab, setActiveTab, onBookNewRide }) {
  const [filter, setFilter] = useState('ALL'); // ALL, SUCCESS, REJECT
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null); // Modal state for viewing/editing receipt
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Helper to load available fleet vehicles from Admin
  const getAvailableVehicles = () => {
    try {
      const saved = localStorage.getItem('cabsy_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_VEHICLES;
  };

  // Load real user inquiries from localStorage, Firestore & TiDB Cloud
  const loadInquiries = async () => {
    let localList = [];
    try {
      const saved = localStorage.getItem('cabsy_inquiries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) localList = parsed;
      }
    } catch (e) {
      console.error("Failed to parse cabsy_inquiries", e);
    }

    // Auto-sync local inquiries to Firestore & TiDB Cloud in background
    localList.forEach(inq => {
      if (inq && (inq.id || inq.pickup)) {
        saveInquiryToFirestore(inq).catch(() => {});
        saveInquiryToTiDB(inq).catch(() => {});
      }
    });

    // Fetch from TiDB Cloud SQL database
    let tidbList = [];
    try {
      tidbList = await loadAllInquiriesFromTiDB();
    } catch (e) {}

    // Merge local + TiDB list (deduplicated by ID)
    const combined = [...localList];
    const existingIds = new Set(combined.map(i => i.id).filter(Boolean));

    (tidbList || []).forEach(tidbItem => {
      if (tidbItem && tidbItem.id && !existingIds.has(tidbItem.id)) {
        combined.push(tidbItem);
        existingIds.add(tidbItem.id);
      }
    });

    setInquiries(combined);
  };

  useEffect(() => {
    loadInquiries();

    const handleStorageChange = () => loadInquiries();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('taxigo_ride_booked', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('taxigo_ride_booked', handleStorageChange);
    };
  }, []);

  // Cancel Inquiry Action
  const handleCancelInquiry = (inqId) => {
    if (!window.confirm("Are you sure you want to cancel this booking inquiry?")) return;

    try {
      const updatedList = inquiries.map(item => {
        if (item.id === inqId || (item.createdAt && item.createdAt === inqId)) {
          return { ...item, status: 'Cancelled' };
        }
        return item;
      });

      localStorage.setItem('cabsy_inquiries', JSON.stringify(updatedList));
      setInquiries(updatedList);
      if (selectedInquiry && (selectedInquiry.id === inqId || selectedInquiry.createdAt === inqId)) {
        setSelectedInquiry(prev => prev ? { ...prev, status: 'Cancelled' } : null);
      }

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('taxigo_inquiry_cancelled', { detail: { id: inqId } }));
    } catch (e) {
      console.error("Error cancelling inquiry:", e);
    }
  };

  // Save Edit Receipt Action
  const handleSaveEdit = (e) => {
    e.preventDefault();
    try {
      const updatedList = inquiries.map(item => {
        if (item.id === editForm.id || (item.createdAt && item.createdAt === editForm.createdAt)) {
          return { ...item, ...editForm };
        }
        return item;
      });

      localStorage.setItem('cabsy_inquiries', JSON.stringify(updatedList));
      setInquiries(updatedList);
      setSelectedInquiry(editForm);
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Error saving inquiry edit:", err);
    }
  };

  // Filter logic for 3 tabs: ALL, SUCCESS, REJECT
  const getFilteredInquiries = () => {
    return inquiries.filter(item => {
      const st = (item.status || 'Pending').toLowerCase();
      if (filter === 'ALL') return true;
      if (filter === 'SUCCESS') {
        return st.includes('approve') || st.includes('confirm') || st.includes('success') || st.includes('completed');
      }
      if (filter === 'REJECT') {
        return st.includes('reject') || st.includes('decline') || st.includes('cancel');
      }
      return true;
    });
  };

  const filteredInquiries = getFilteredInquiries();

  const getStatusBadge = (statusStr) => {
    const st = (statusStr || 'Pending').toLowerCase();

    if (st.includes('approve') || st.includes('confirm') || st.includes('success') || st.includes('completed')) {
      return {
        label: '✅ Approved / Confirmed',
        bg: '#DCFCE7',
        border: '#86EFAC',
        color: '#15803D',
        canCancel: false
      };
    }
    if (st.includes('reject') || st.includes('decline') || st.includes('cancel')) {
      return {
        label: '❌ Cancelled / Rejected',
        bg: '#FEE2E2',
        border: '#FCA5A5',
        color: '#B91C1C',
        canCancel: false
      };
    }
    return {
      label: '⏳ Pending Approval',
      bg: '#F1F5F9',
      border: '#CBD5E1',
      color: '#475569',
      canCancel: true
    };
  };

  return (
    <div className="real-mobile-app">
      {/* Header Nav */}
      <div className="white-header-nav" style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <h2 className="white-header-title" style={{ fontFamily: 'League Spartan', fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
          My Rides & Inquiries
        </h2>
      </div>

      <div className="app-scroll-content" style={{ padding: '16px 20px 90px 20px' }}>
        {/* 3 FILTER TABS: ALL | SUCCESS | REJECT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {[
            { key: 'ALL', label: 'All Rides', count: inquiries.length },
            { 
              key: 'SUCCESS', 
              label: 'Success', 
              count: inquiries.filter(i => {
                const st = (i.status || '').toLowerCase();
                return st.includes('approve') || st.includes('confirm') || st.includes('success') || st.includes('completed');
              }).length 
            },
            { 
              key: 'REJECT', 
              label: 'Rejected', 
              count: inquiries.filter(i => {
                const st = (i.status || '').toLowerCase();
                return st.includes('reject') || st.includes('decline') || st.includes('cancel');
              }).length 
            }
          ].map(tab => {
            const isSelected = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #34D399' : '1.5px solid #E2E8F0',
                  background: isSelected ? '#F0FDF4' : '#FFFFFF',
                  color: isSelected ? '#0F172A' : '#64748B',
                  fontFamily: 'League Spartan, sans-serif',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(52, 211, 153, 0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>{tab.label}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: isSelected ? '#059669' : '#94A3B8' }}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* INQUIRIES LIST (NO DEMO DATA) */}
        {filteredInquiries.length === 0 ? (
          <div style={{ padding: '40px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', marginTop: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚕</div>
            <h3 style={{ fontFamily: 'League Spartan', fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' }}>
              No {filter === 'SUCCESS' ? 'Confirmed' : filter === 'REJECT' ? 'Rejected' : ''} Trips Found
            </h3>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
              {filter === 'ALL' ? "You haven't submitted any ride inquiries yet." : `No inquiries found in ${filter.toLowerCase()} tab.`}
            </p>
            <button
              onClick={onBookNewRide}
              style={{
                background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '14px',
                fontFamily: 'League Spartan',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(52, 211, 153, 0.35)'
              }}
            >
              Book New Trip →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredInquiries.map((inq, index) => {
              const badge = getStatusBadge(inq.status);
              const inqId = inq.id || inq.createdAt || `INQ-${index}`;
              return (
                <div
                  key={inqId}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '16px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedInquiry(inq);
                    setEditForm(inq);
                    setIsEditing(false);
                  }}
                >
                  {/* Top Bar ID & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontFamily: 'League Spartan', fontWeight: '800', color: '#0F172A', fontSize: '16px' }}>
                        {inq.id || `INQ-#${1000 + index}`}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', marginLeft: '8px', textTransform: 'uppercase' }}>
                        {inq.tripType === 'round-trip' ? '• Round Trip' : '• One-Way'}
                      </span>
                    </div>

                    <span 
                      style={{
                        background: badge.bg,
                        border: `1px solid ${badge.border}`,
                        color: badge.color,
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '800',
                        fontFamily: 'League Spartan'
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px', fontFamily: 'Space Grotesk', fontWeight: '600' }}>
                    📅 {inq.scheduledDate || 'Today'} • {inq.scheduledTime || '04:30 PM'}
                  </div>

                  {/* Route Box */}
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '14px', marginBottom: '12px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#22C55E', fontWeight: 'bold' }}>●</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'League Spartan' }}>
                        {inq.pickup || inq.pickupLoc || 'Pickup Location'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#EF4444', fontWeight: 'bold' }}>📍</span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', fontFamily: 'League Spartan' }}>
                        {inq.dropoff || inq.dropoffLoc || 'Destination Point'}
                      </span>
                    </div>
                  </div>

                  {/* Car, Fare & Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                    <div>
                      <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '15px', fontFamily: 'League Spartan' }}>
                        {inq.vehicle || inq.carName || inq.selectedCar || 'SWIFT'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', fontFamily: 'Space Grotesk' }}>
                        {typeof inq.price === 'string' ? inq.price : (inq.fare ? `₹${inq.fare.toLocaleString('en-IN')}` : '₹0')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInquiry(inq);
                          setEditForm(inq);
                          setIsEditing(false);
                        }}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          color: '#0F172A',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontFamily: 'League Spartan',
                          fontWeight: '800',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        View Receipt
                      </button>

                      {badge.canCancel && (
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelInquiry(inq.id || inq.createdAt);
                          }}
                          style={{
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            color: '#DC2626',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontFamily: 'League Spartan',
                            fontWeight: '800',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED RECEIPT & EDIT MODAL */}
      {selectedInquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '420px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'League Spartan', fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  {isEditing ? 'Edit Inquiry Receipt' : 'Inquiry Receipt'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'Space Grotesk' }}>
                  {selectedInquiry.id || 'INQ-REF'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)} 
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', color: '#0F172A', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {!isEditing ? (
              /* VIEW RECEIPT DETAILS */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>STATUS:</span>
                  <span style={{ background: getStatusBadge(selectedInquiry.status).bg, border: `1px solid ${getStatusBadge(selectedInquiry.status).border}`, color: getStatusBadge(selectedInquiry.status).color, padding: '6px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '800', fontFamily: 'League Spartan' }}>
                    {getStatusBadge(selectedInquiry.status).label}
                  </span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block' }}>PICKUP LOCATION</span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', fontFamily: 'League Spartan' }}>{selectedInquiry.pickup || selectedInquiry.pickupLoc}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block' }}>DESTINATION POINT</span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', fontFamily: 'League Spartan' }}>{selectedInquiry.dropoff || selectedInquiry.dropoffLoc}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block' }}>SCHEDULED DATE</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{selectedInquiry.scheduledDate || 'Today'}</span>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'block' }}>TIME</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', fontFamily: 'Space Grotesk' }}>{selectedInquiry.scheduledTime || '04:30 PM'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F0FDF4', border: '1.5px solid #BBF7D0', padding: '14px', borderRadius: '16px', marginBottom: '20px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', display: 'block' }}>VEHICLE</span>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', fontFamily: 'League Spartan' }}>{selectedInquiry.vehicle || selectedInquiry.carName || selectedInquiry.selectedCar || 'SWIFT'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', display: 'block' }}>TOTAL FARE</span>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#10B981', fontFamily: 'League Spartan' }}>{typeof selectedInquiry.price === 'string' ? selectedInquiry.price : (selectedInquiry.fare ? `₹${selectedInquiry.fare.toLocaleString('en-IN')}` : '₹0')}</span>
                  </div>
                </div>

                {/* MODAL ACTION BUTTONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setEditForm(selectedInquiry);
                      setIsEditing(true);
                    }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '16px',
                      fontFamily: 'League Spartan',
                      fontSize: '16px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(52, 211, 153, 0.35)'
                    }}
                  >
                    ✏️ Edit Inquiry Details
                  </button>

                  {getStatusBadge(selectedInquiry.status).canCancel && (
                    <button
                      onClick={() => handleCancelInquiry(selectedInquiry.id || selectedInquiry.createdAt)}
                      style={{
                        width: '100%',
                        background: '#FEF2F2',
                        border: '1.5px solid #FECACA',
                        color: '#DC2626',
                        padding: '14px',
                        borderRadius: '16px',
                        fontFamily: 'League Spartan',
                        fontSize: '16px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Cancel Inquiry
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* EDIT RECEIPT FORM */
              <form onSubmit={handleSaveEdit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '4px' }}>PICKUP LOCATION</label>
                  <input 
                    type="text"
                    value={editForm.pickup || editForm.pickupLoc || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, pickup: e.target.value, pickupLoc: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontFamily: 'Space Grotesk', fontWeight: '700', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '4px' }}>DESTINATION POINT</label>
                  <input 
                    type="text"
                    value={editForm.dropoff || editForm.dropoffLoc || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dropoff: e.target.value, dropoffLoc: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontFamily: 'Space Grotesk', fontWeight: '700', boxSizing: 'border-box' }}
                  />
                </div>

                {/* DATE & TIME DROPDOWNS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '4px' }}>SCHEDULED DATE</label>
                    <select
                      value={editForm.scheduledDate || 'Today, 10 Aug 2026'}
                      onChange={(e) => setEditForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontFamily: 'Space Grotesk', fontWeight: '700', background: '#FFFFFF', color: '#0F172A', boxSizing: 'border-box' }}
                    >
                      {["Today, 10 Aug 2026", "Tomorrow, 11 Aug 2026", "Wed, 12 Aug 2026", "Thu, 13 Aug 2026", "Fri, 14 Aug 2026", "Sat, 15 Aug 2026"].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '4px' }}>PICKUP TIME</label>
                    <select
                      value={editForm.scheduledTime || '04:30 PM'}
                      onChange={(e) => setEditForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontFamily: 'Space Grotesk', fontWeight: '700', background: '#FFFFFF', color: '#0F172A', boxSizing: 'border-box' }}
                    >
                      {[
                        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
                        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM"
                      ].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* VEHICLE / FLEET CAR DROPDOWN */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', display: 'block', marginBottom: '4px' }}>FLEET VEHICLE CAR</label>
                  <select
                    value={editForm.vehicle || editForm.carName || ''}
                    onChange={(e) => {
                      const selName = e.target.value;
                      const vehicles = getAvailableVehicles();
                      const matched = vehicles.find(v => v.name === selName);
                      const rate = Number(matched?.ratePerKm || matched?.pricePerKm || matched?.rate) || 5;
                      const newFare = Math.round(rate * 154); // default route distance
                      setEditForm(prev => ({
                        ...prev,
                        vehicle: selName,
                        carName: selName,
                        fare: newFare,
                        price: `₹${newFare.toLocaleString('en-IN')}`
                      }));
                    }}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontFamily: 'Space Grotesk', fontWeight: '700', background: '#FFFFFF', color: '#0F172A', boxSizing: 'border-box' }}
                  >
                    {getAvailableVehicles().map(v => (
                      <option key={v.id || v.name} value={v.name}>
                        🚗 {v.name} — ₹{v.ratePerKm || v.rate || 5}/km
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{ flex: 1, background: '#F1F5F9', border: 'none', padding: '14px', borderRadius: '16px', fontFamily: 'League Spartan', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: '#FFFFFF', border: 'none', padding: '14px', borderRadius: '16px', fontFamily: 'League Spartan', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(52, 211, 153, 0.35)' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Bottom Navigation Toolbar */}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
