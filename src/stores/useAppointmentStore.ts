import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { Doctor } from '../types/doctor'
import type { PatientForm } from '../types/index'

export const useAppointmentStore = defineStore('appointment', () => {
  const isOpen = ref(false)
  const currentStep = ref<1 | 2 | 3>(1)
  const selectedDoctor = ref<Doctor | null>(null)
  const selectedServiceName = ref<string>('')
  const selectedClinicId = ref<number | null>(null)
  const selectedDate = ref<string | null>(null)
  const selectedTime = ref<string | null>(null)
  const isSubmitting = ref(false)
  const isSuccess = ref(false)

  const patientData = reactive<PatientForm>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    comment: '',
    agreePersonalData: false,
  })

  function openModal(doctor?: Doctor) {
    isOpen.value = true
    isSuccess.value = false
    currentStep.value = 1
    // Reset doctor only if opening fresh (no specific doctor passed)
    if (doctor) {
      selectedDoctor.value = doctor
    } else if (!selectedDoctor.value) {
      selectedDoctor.value = null
    }
    // Reset date/time on each open
    selectedDate.value = null
    selectedTime.value = null
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    isOpen.value = false
    document.body.style.overflow = ''
  }

  function nextStep() {
    if (currentStep.value < 3) currentStep.value = (currentStep.value + 1) as 1 | 2 | 3
  }

  function prevStep() {
    if (currentStep.value > 1) currentStep.value = (currentStep.value - 1) as 1 | 2 | 3
  }

  function resetForm() {
    currentStep.value = 1
    selectedDoctor.value = null
    selectedServiceName.value = ''
    selectedClinicId.value = null
    selectedDate.value = null
    selectedTime.value = null
    isSuccess.value = false
    Object.assign(patientData, { name: '', phone: '', email: '', birthDate: '', comment: '', agreePersonalData: false })
  }

  async function submitAppointment() {
    isSubmitting.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      isSuccess.value = true
      currentStep.value = 3
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isOpen, currentStep, selectedDoctor, selectedServiceName,
    selectedClinicId, selectedDate, selectedTime,
    patientData, isSubmitting, isSuccess,
    openModal, closeModal, nextStep, prevStep, resetForm, submitAppointment,
  }
})
