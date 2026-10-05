import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { submitContact } from './contactController.js';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

// Hook compartido por los dos formularios de contacto.
export default function useContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startedAt = useRef(Date.now());

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await submitContact(values, { honeypot: values.website, startedAt: startedAt.current });
    setIsSubmitting(false);

    if (result.ok) {
      toast.success(result.message);
      setValues(EMPTY);
      setErrors({});
      startedAt.current = Date.now();
      return;
    }

    setErrors(result.errors ?? {});
    toast.error(result.message);
  };

  return { values, errors, isSubmitting, handleChange, handleSubmit };
}
