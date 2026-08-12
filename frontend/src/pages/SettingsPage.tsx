import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Save, Database, DollarSign, CheckCircle2, UserPlus, LogOut, Search, ChevronDown, Check } from 'lucide-react'
import { useCompany } from '../stores/useCompany'

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  region: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', region: 'Asia' },
  { code: 'USD', symbol: '$', name: 'United States Dollar', flag: '🇺🇸', region: 'Americas' },
  { code: 'EUR', symbol: '€', name: 'Eurozone Euro', flag: '🇪🇺', region: 'Europe' },
  { code: 'GBP', symbol: '£', name: 'British Pound Sterling', flag: '🇬🇧', region: 'Europe' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', region: 'Asia' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', region: 'Americas' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', region: 'Oceania' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', region: 'Middle East' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', flag: '🇸🇦', region: 'Middle East' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', region: 'Europe' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan Renminbi', flag: '🇨🇳', region: 'Asia' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', region: 'Asia' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰', region: 'Asia' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', region: 'Asia' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', region: 'Americas' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', flag: '🇲🇽', region: 'Americas' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', region: 'Europe' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', flag: '🇿🇦', region: 'Africa' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', flag: '🇸🇪', region: 'Europe' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', flag: '🇳🇴', region: 'Europe' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', flag: '🇩🇰', region: 'Europe' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', flag: '🇵🇱', region: 'Europe' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷', region: 'Middle East' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', flag: '🇹🇭', region: 'Asia' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', flag: '🇮🇩', region: 'Asia' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', flag: '🇲🇾', region: 'Asia' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', flag: '🇵🇭', region: 'Asia' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', flag: '🇻🇳', region: 'Asia' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', flag: '🇪🇬', region: 'Africa' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel', flag: '🇮🇱', region: 'Middle East' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', flag: '🇳🇿', region: 'Oceania' },
  { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar', flag: '🇰🇼', region: 'Middle East' },
  { code: 'QAR', symbol: 'ر.ق', name: 'Qatari Riyal', flag: '🇶🇦', region: 'Middle East' },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin (Crypto)', flag: '🪙', region: 'Crypto' },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum (Crypto)', flag: '🔷', region: 'Crypto' },
];

export default function SettingsPage() {
  const navigate = useNavigate()
  const { company, updateCompany } = useCompany()
  const [formData, setFormData] = useState(company)
  const [savedMessage, setSavedMessage] = useState(false)

  // Currency Dropdown UX state
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCurrencyObj = CURRENCIES.find(
    (c) => formData.currency.includes(c.code) || formData.currency.includes(c.symbol)
  ) || CURRENCIES[0];

  const filteredCurrencies = CURRENCIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateCompany(formData)
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2.5">
          <Building2 className="text-blue-600" size={28} />
          Company Profile & Settings
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure enterprise company context, industry, database preferences, and reporting currency.
        </p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-sm">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>Company profile updated successfully! All AI responses are now grounded for {formData.name}.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Company / Enterprise Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
              placeholder="e.g. Acme Global Enterprises"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Industry Sector
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
              placeholder="e.g. E-Commerce & Retail Analytics"
              required
            />
          </div>

          {/* Custom Reporting Currency Selector */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#CB2958]" /> Reporting Currency
              </span>
              <span className="text-[10px] font-black text-[#CB2958] bg-[#CB2958]/10 px-2 py-0.5 rounded-md">
                35 Global Currencies
              </span>
            </label>

            {/* Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#CB2958] bg-white flex items-center justify-between text-sm font-semibold shadow-sm hover:border-[#CB2958] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCurrencyObj.flag}</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900 leading-none flex items-center gap-2">
                    <span>{selectedCurrencyObj.code}</span>
                    <span className="text-xs text-[#CB2958] font-black bg-gray-100 px-1.5 py-0.5 rounded">
                      {selectedCurrencyObj.symbol}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">{selectedCurrencyObj.name}</div>
                </div>
              </div>
              <ChevronDown size={18} className={`text-gray-400 transition-transform ${isCurrencyOpen ? 'rotate-180 text-[#CB2958]' : ''}`} />
            </button>

            {/* Dropdown Popover */}
            {isCurrencyOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden p-4 space-y-3 animate-in fade-in duration-200">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search currency, code, or symbol..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#CB2958] focus:bg-white transition-all"
                    autoFocus
                  />
                </div>

                {/* Popular Quick Chips */}
                {!searchQuery && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Popular Quick-Select</div>
                    <div className="flex flex-wrap gap-1.5">
                      {['INR', 'USD', 'EUR', 'GBP', 'AED', 'JPY', 'CAD'].map((code) => {
                        const cur = CURRENCIES.find((c) => c.code === code)!;
                        const isSelected = selectedCurrencyObj.code === code;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, currency: `${cur.code} (${cur.symbol}) - ${cur.name}` });
                              setIsCurrencyOpen(false);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#CB2958] text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <span>{cur.flag}</span>
                            <span>{cur.code} ({cur.symbol})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Currencies Scroll List */}
                <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 mb-1">
                    {filteredCurrencies.length} Currencies Available
                  </div>
                  {filteredCurrencies.map((c) => {
                    const isSelected = selectedCurrencyObj.code === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, currency: `${c.code} (${c.symbol}) - ${c.name}` });
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#CB2958]/10 text-[#CB2958] font-bold border border-[#CB2958]/30'
                            : 'hover:bg-gray-50 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{c.flag}</span>
                          <div>
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <span>{c.name}</span>
                              <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                                {c.symbol}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-semibold">{c.code} • {c.region}</div>
                          </div>
                        </div>
                        {isSelected && <Check size={16} className="text-[#CB2958]" />}
                      </button>
                    );
                  })}

                  {filteredCurrencies.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400 font-medium">
                      No currencies matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Database size={14} className="text-blue-600" /> Primary Database Engine
            </label>
            <select
              value={formData.primaryDatabase}
              onChange={(e) => setFormData({ ...formData, primaryDatabase: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-white"
            >
              <option value="PostgreSQL / SQLite">PostgreSQL / SQLite</option>
              <option value="MySQL">MySQL Enterprise</option>
              <option value="Snowflake">Snowflake Data Cloud</option>
              <option value="Supabase">Supabase PostgreSQL</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Business Operations Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm h-28 leading-relaxed"
            placeholder="Describe your company's core products, markets, and business model..."
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            <Save size={16} />
            <span>Save Company Profile</span>
          </button>
        </div>
      </form>

      {/* Account & Authentication Options */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <UserPlus className="text-[#CB2958]" size={22} />
          Account & Authentication
        </h2>
        <p className="text-xs text-gray-600 font-medium">
          Manage your account credentials, register a new team account, or sign out.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="bg-[#CB2958] hover:bg-[#b0234c] text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Sign Up / Switch Account</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Log Out to Landing Page</span>
          </button>
        </div>
      </div>
    </div>
  )
}
