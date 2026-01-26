/**
 * Hook useViaCep
 * Hook personalizado para buscar endereços pela API ViaCEP
 */

import { useState } from 'react';
import axios from 'axios';
import { ViaCepResponse } from '@/modules/patients/presentation/forms/PatientFormSchema';

interface UseViaCepReturn {
  loading: boolean;
  error: string | null;
  fetchAddress: (cep: string) => Promise<ViaCepResponse | null>;
}

/**
 * Hook para buscar endereço pelo CEP usando a API ViaCEP
 * 
 * @example
 * const { loading, error, fetchAddress } = useViaCep();
 * const address = await fetchAddress('01310100');
 */
export function useViaCep(): UseViaCepReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async (cep: string): Promise<ViaCepResponse | null> => {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');

    // Valida formato do CEP
    if (cleanCep.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );

      // ViaCEP retorna { erro: true } quando o CEP não é encontrado
      if (response.data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return response.data;
    } catch (err) {
      const errorMessage = 'Erro ao buscar CEP. Verifique sua conexão.';
      setError(errorMessage);
      console.error('Erro ao buscar CEP:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchAddress,
  };
}
