import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiSave } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ShippingAddress } from '../types';
import axios from 'axios';

interface AddressFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  onSave?: (address: ShippingAddress) => void;
  savedAddress?: string;
}

export default function AddressForm({ address, onChange, onSave, savedAddress }: AddressFormProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([40.4168, -3.7038], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    const updateMap = async () => {
      const query = `${address.street} ${address.houseNumber} ${address.city} ${address.country}`;
      if (query.trim().length < 5) return;

      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        if (res.data && res.data[0]) {
          const { lat, lon } = res.data[0];
          const position = L.latLng(parseFloat(lat), parseFloat(lon));
          
          if (mapRef.current) {
            mapRef.current.setView(position, 16);
            if (markerRef.current) {
              markerRef.current.setLatLng(position);
            } else {
              markerRef.current = L.marker(position).addTo(mapRef.current);
            }
          }
        }
      } catch (err) {
        console.error('Error updating map position:', err);
      }
    };

    const timer = setTimeout(updateMap, 1000);
    return () => clearTimeout(timer);
  }, [address]);

  const fetchSuggestions = async (val: string) => {
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5&countrycodes=es`);
      setSuggestions(res.data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Nominatim error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (s: any) => {
    const addr = s.address;
    const newAddress: ShippingAddress = {
      street: addr.road || addr.pedestrian || addr.suburb || '',
      houseNumber: addr.house_number || '',
      postalCode: addr.postcode || '',
      city: addr.city || addr.town || addr.village || addr.municipality || '',
      country: addr.country_code?.toUpperCase() || 'ES'
    };
    onChange(newAddress);
    setShowSuggestions(false);
  };

  const updateField = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...address, [field]: value });
  };

  const useSavedAddress = () => {
    if (!savedAddress) return;
    try {
      const parsed = JSON.parse(savedAddress);
      onChange(parsed);
    } catch (e) {
      // Fallback if not JSON
      updateField('street', savedAddress);
    }
  };

  return (
    <div className="address-form">
      {savedAddress && (
        <button 
          type="button" 
          className="btn btn--ghost btn--sm" 
          onClick={useSavedAddress}
          style={{ alignSelf: 'flex-start', marginBottom: '-10px' }}
        >
          <FiMapPin size={14} /> Usar mi dirección guardada
        </button>
      )}

      <div className="auth-form__field" style={{ position: 'relative' }}>
        <label>Calle *</label>
        <div className="auth-form__input-wrapper">
          <FiMapPin size={18} />
          <input
            type="text"
            placeholder="Nombre de la calle"
            value={address.street}
            onChange={(e) => {
              updateField('street', e.target.value);
              fetchSuggestions(e.target.value);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {loading && <div className="loading-spinner--xs" />}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="address-form__suggestions">
            {suggestions.map((s, i) => (
              <div 
                key={i} 
                className="address-form__suggestion"
                onClick={() => handleSuggestionClick(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="address-form__grid">
        <div className="auth-form__field">
          <label>Nº / Piso / Puerta</label>
          <div className="auth-form__input-wrapper">
            <input
              type="text"
              placeholder="Ej: 12, 1ºA"
              value={address.houseNumber}
              onChange={(e) => updateField('houseNumber', e.target.value)}
            />
          </div>
        </div>
        <div className="auth-form__field">
          <label>Cód. Postal *</label>
          <div className="auth-form__input-wrapper">
            <input
              type="text"
              placeholder="28001"
              value={address.postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="address-form__row">
        <div className="auth-form__field" style={{ flex: 1 }}>
          <label>Ciudad *</label>
          <div className="auth-form__input-wrapper">
            <input
              type="text"
              placeholder="Madrid"
              value={address.city}
              onChange={(e) => updateField('city', e.target.value)}
            />
          </div>
        </div>
        <div className="auth-form__field" style={{ flex: 1 }}>
          <label>País *</label>
          <div className="auth-form__input-wrapper">
            <select 
              value={address.country}
              onChange={(e) => updateField('country', e.target.value)}
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none' }}
            >
              <option value="ES">España</option>
              <option value="PT">Portugal</option>
              <option value="FR">Francia</option>
              <option value="IT">Italia</option>
              <option value="DE">Alemania</option>
            </select>
          </div>
        </div>
      </div>

      <div className="address-form__map-container" ref={mapContainerRef}></div>

      {onSave && (
        <button 
          type="button" 
          className="btn btn--outline btn--sm" 
          onClick={() => onSave(address)}
          style={{ width: 'fit-content' }}
        >
          <FiSave size={16} /> Guardar esta dirección en mi perfil
        </button>
      )}
    </div>
  );
}
