import { useState, useEffect } from 'react'
import { orderService } from '@/services/orderService'

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  state: string
  zipCode: string
  phone: string
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}

interface CheckoutState {
  formData: CheckoutFormData
  deliveryMethod: string
  paymentMethod: string
  isProcessing: boolean
  isPincodeValid: boolean
  pincodeValidating: boolean
  errors: Record<string, string>
}

export const useCheckout = () => {
  const [state, setState] = useState<CheckoutState>({
    formData: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
    },
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    isProcessing: false,
    isPincodeValid: false,
    pincodeValidating: false,
    errors: {}
  })

  // Real-time pincode validation
  useEffect(() => {
    const validatePincode = async () => {
      if (state.formData.zipCode.length === 6) {
        setState(prev => ({ ...prev, pincodeValidating: true }))
        const isValid = await orderService.validatePincode(state.formData.zipCode)
        setState(prev => ({ 
          ...prev, 
          isPincodeValid: isValid,
          pincodeValidating: false,
          errors: {
            ...prev.errors,
            zipCode: isValid ? '' : 'Delivery not available for this pincode'
          }
        }))
      } else {
        setState(prev => ({ 
          ...prev, 
          isPincodeValid: false,
          errors: { ...prev.errors, zipCode: '' }
        }))
      }
    }

    if (state.formData.zipCode) {
      const timer = setTimeout(validatePincode, 500)
      return () => clearTimeout(timer)
    }
  }, [state.formData.zipCode])

  const updateFormData = (field: keyof CheckoutFormData, value: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      errors: { ...prev.errors, [field]: '' }
    }))
  }

  const updateDeliveryMethod = (method: string) => {
    setState(prev => ({ ...prev, deliveryMethod: method }))
  }

  const updatePaymentMethod = (method: string) => {
    setState(prev => ({ ...prev, paymentMethod: method }))
  }

  const setProcessing = (processing: boolean) => {
    setState(prev => ({ ...prev, isProcessing: processing }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    const { formData } = state

    if (!formData.email) errors.email = 'Email is required'
    if (!formData.firstName) errors.firstName = 'First name is required'
    if (!formData.lastName) errors.lastName = 'Last name is required'
    if (!formData.address) errors.address = 'Address is required'
    if (!formData.city) errors.city = 'City is required'
    if (!formData.state) errors.state = 'State is required'
    if (!formData.zipCode) errors.zipCode = 'Pincode is required'
    if (!formData.phone) errors.phone = 'Phone is required'
    if (!state.isPincodeValid && formData.zipCode) errors.zipCode = 'Invalid pincode'

    if (state.paymentMethod === 'card') {
      if (!formData.nameOnCard) errors.nameOnCard = 'Name on card is required'
      if (!formData.cardNumber) errors.cardNumber = 'Card number is required'
      if (!formData.expiryDate) errors.expiryDate = 'Expiry date is required'
      if (!formData.cvv) errors.cvv = 'CVV is required'
    }

    setState(prev => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }

  return {
    ...state,
    updateFormData,
    updateDeliveryMethod,
    updatePaymentMethod,
    setProcessing,
    validateForm
  }
}