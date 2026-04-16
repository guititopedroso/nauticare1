import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { forwardRef } from 'react'

const CustomPhoneInput = forwardRef<any, any>(({ value, onChange, placeholder, className, ...props }, ref) => {
  return (
    <div className="phone-input-wrapper w-full">
      <PhoneInput
        international
        defaultCountry="PT"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex h-12 w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      <style>{`
        .PhoneInput {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: inherit;
          color: inherit;
        }
        .PhoneInputCountry {
          display: flex;
          align-items: center;
          padding-right: 0.5rem;
          border-right: 1px solid #e5e7eb;
        }
        .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
        .PhoneInputCountryIcon {
          width: 1.5rem;
          height: auto;
        }
      `}</style>
    </div>
  )
})

CustomPhoneInput.displayName = 'CustomPhoneInput'

export { CustomPhoneInput }
