/**
 * PatientForm Component
 * Formulário completo de cadastro de pacientes
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';

import { PatientFormData, patientFormSchema } from '../forms/PatientFormSchema';
import { PatientStatus } from '@/modules/patients/domain/Patient.entity';
import { useViaCep } from '@/shared/hooks/useViaCep';
import { maskCPF, maskCEP, maskPhone, unmaskCPF, unmaskCEP, unmaskPhone } from '@/shared/utils/inputMasks';
import { ConfirmationDialog } from '@/shared/ui/confirmation-dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useToast } from '@/shared/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
}

export function PatientForm({ onSubmit, onCancel }: PatientFormProps) {
  const { toast } = useToast();
  const { loading: loadingCep, fetchAddress } = useViaCep();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'save' | 'clear' | 'cancel' | null;
  }>({ open: false, type: null });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      status: 'Avaliação',
    },
  });

  const zipCodeValue = watch('zipCode');

  // Buscar endereço pelo CEP
  const handleFetchAddress = async () => {
    if (!zipCodeValue || zipCodeValue.length < 8) {
      toast({
        title: 'CEP inválido',
        description: 'Digite um CEP válido com 8 dígitos',
        variant: 'destructive',
      });
      return;
    }

    const address = await fetchAddress(zipCodeValue);
    
    if (address) {
      setValue('street', address.logradouro);
      setValue('neighborhood', address.bairro);
      setValue('city', address.localidade);
      setValue('state', address.uf);
      setValue('complement', address.complemento);
      
      toast({
        title: 'Endereço encontrado',
        description: 'Os campos foram preenchidos automaticamente',
      });
    } else {
      toast({
        title: 'CEP não encontrado',
        description: 'Verifique o CEP digitado e tente novamente',
        variant: 'destructive',
      });
    }
  };

  // Handlers para confirmação
  const handleConfirmSave = () => {
    setConfirmDialog({ open: true, type: 'save' });
  };

  const handleConfirmClear = () => {
    setConfirmDialog({ open: true, type: 'clear' });
  };

  const handleConfirmCancel = () => {
    setConfirmDialog({ open: true, type: 'cancel' });
  };

  const handleConfirm = () => {
    if (confirmDialog.type === 'save') {
      handleSubmit(onSubmit)();
    } else if (confirmDialog.type === 'clear') {
      reset();
      toast({
        title: 'Formulário limpo',
        description: 'Todos os campos foram resetados',
      });
    } else if (confirmDialog.type === 'cancel') {
      onCancel();
    }
  };

  // Status options
  const statusOptions = Object.values(PatientStatus);

  return (
    <>
      <form className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados pessoais do paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Digite o nome completo"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  onValueChange={(value) => setValue('status', value as PatientFormData['status'])}
                  defaultValue="Avaliação"
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  {...register('cpf')}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  onChange={(e) => {
                    const masked = maskCPF(e.target.value);
                    e.target.value = masked;
                    setValue('cpf', unmaskCPF(masked));
                  }}
                />
                {errors.cpf && (
                  <p className="text-sm text-destructive">{errors.cpf.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  {...register('birthDate')}
                />
                {errors.birthDate && (
                  <p className="text-sm text-destructive">{errors.birthDate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Localização do paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP *</Label>
                <div className="flex gap-2">
                  <Input
                    id="zipCode"
                    {...register('zipCode')}
                    placeholder="00000-000"
                    maxLength={9}
                    onChange={(e) => {
                      const masked = maskCEP(e.target.value);
                      e.target.value = masked;
                      setValue('zipCode', unmaskCEP(masked));
                    }}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleFetchAddress}
                        disabled={loadingCep}
                        aria-label="Buscar endereço pelo CEP"
                      >
                        {loadingCep ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Buscar endereço pelo CEP</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {errors.zipCode && (
                  <p className="text-sm text-destructive">{errors.zipCode.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Rua/Logradouro *</Label>
                <Input
                  id="street"
                  {...register('street')}
                  placeholder="Nome da rua"
                />
                {errors.street && (
                  <p className="text-sm text-destructive">{errors.street.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  {...register('number')}
                  placeholder="123"
                />
                {errors.number && (
                  <p className="text-sm text-destructive">{errors.number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  {...register('complement')}
                  placeholder="Apto 45"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  {...register('neighborhood')}
                  placeholder="Nome do bairro"
                />
                {errors.neighborhood && (
                  <p className="text-sm text-destructive">{errors.neighborhood.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Nome da cidade"
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="UF"
                  maxLength={2}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>Dados para comunicação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    e.target.value = masked;
                    setValue('phone', unmaskPhone(masked));
                  }}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Médicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Médicas</CardTitle>
            <CardDescription>Histórico e condições do paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryCid">CID Principal *</Label>
                <Input
                  id="primaryCid"
                  {...register('primaryCid')}
                  placeholder="Ex: I50.0"
                />
                {errors.primaryCid && (
                  <p className="text-sm text-destructive">{errors.primaryCid.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryCid">CID Secundário</Label>
                <Input
                  id="secondaryCid"
                  {...register('secondaryCid')}
                  placeholder="Ex: E11.9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergias</Label>
              <Textarea
                id="allergies"
                {...register('allergies')}
                placeholder="Descreva possíveis alergias do paciente"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contato de Emergência */}
        <Card>
          <CardHeader>
            <CardTitle>Contato de Emergência</CardTitle>
            <CardDescription>Pessoa a ser contatada em caso de emergência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nome do Contato *</Label>
                <Input
                  id="emergencyContactName"
                  {...register('emergencyContactName')}
                  placeholder="Nome completo"
                />
                {errors.emergencyContactName && (
                  <p className="text-sm text-destructive">
                    {errors.emergencyContactName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Telefone do Contato *</Label>
                <Input
                  id="emergencyContactPhone"
                  {...register('emergencyContactPhone')}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    e.target.value = masked;
                    setValue('emergencyContactPhone', unmaskPhone(masked));
                  }}
                />
                {errors.emergencyContactPhone && (
                  <p className="text-sm text-destructive">
                    {errors.emergencyContactPhone.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admissão */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Admissão</CardTitle>
            <CardDescription>Dados de entrada do paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admissionDate">Data de Admissão *</Label>
              <Input
                id="admissionDate"
                type="date"
                {...register('admissionDate')}
              />
              {errors.admissionDate && (
                <p className="text-sm text-destructive">{errors.admissionDate.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plano de Saúde */}
        <Card>
          <CardHeader>
            <CardTitle>Plano de Saúde</CardTitle>
            <CardDescription>Informações do convênio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="healthInsuranceCard">Carteirinha</Label>
                <Input
                  id="healthInsuranceCard"
                  {...register('healthInsuranceCard')}
                  placeholder="Número da carteirinha"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthInsuranceProvider">Operadora</Label>
                <Input
                  id="healthInsuranceProvider"
                  {...register('healthInsuranceProvider')}
                  placeholder="Ex: Unimed, SulAmérica"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthInsurancePlan">Plano de Saúde</Label>
                <Input
                  id="healthInsurancePlan"
                  {...register('healthInsurancePlan')}
                  placeholder="Ex: Básico 10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipe Responsável */}
        <Card>
          <CardHeader>
            <CardTitle>Equipe Responsável</CardTitle>
            <CardDescription>Profissionais alocados ao paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceProvider">Prestadora</Label>
                <Input
                  id="serviceProvider"
                  {...register('serviceProvider')}
                  placeholder="Nome da prestadora"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedProfessional">Profissional Alocado</Label>
                <Input
                  id="assignedProfessional"
                  {...register('assignedProfessional')}
                  placeholder="Nome do profissional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleDoctor">Médico(a) Responsável</Label>
                <Input
                  id="responsibleDoctor"
                  {...register('responsibleDoctor')}
                  placeholder="Nome do médico"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleNurse">Enfermeiro(a) Responsável</Label>
                <Input
                  id="responsibleNurse"
                  {...register('responsibleNurse')}
                  placeholder="Nome do enfermeiro"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleConfirmClear}
            disabled={isSubmitting}
          >
            Limpar
          </Button>
          <Button
            type="button"
            onClick={handleConfirmSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </div>
      </form>

      {/* Diálogos de Confirmação */}
      <ConfirmationDialog
        open={confirmDialog.open && confirmDialog.type === 'save'}
        onOpenChange={(open) => setConfirmDialog({ open, type: confirmDialog.type })}
        onConfirm={handleConfirm}
        title="Confirmar cadastro"
        description="Tem certeza que deseja salvar este paciente? Verifique se todos os dados estão corretos."
        confirmText="Salvar"
      />

      <ConfirmationDialog
        open={confirmDialog.open && confirmDialog.type === 'clear'}
        onOpenChange={(open) => setConfirmDialog({ open, type: confirmDialog.type })}
        onConfirm={handleConfirm}
        title="Limpar formulário"
        description="Tem certeza que deseja limpar todos os campos? Esta ação não pode ser desfeita."
        confirmText="Limpar"
        variant="destructive"
      />

      <ConfirmationDialog
        open={confirmDialog.open && confirmDialog.type === 'cancel'}
        onOpenChange={(open) => setConfirmDialog({ open, type: confirmDialog.type })}
        onConfirm={handleConfirm}
        title="Cancelar cadastro"
        description="Tem certeza que deseja cancelar? Todos os dados preenchidos serão perdidos."
        confirmText="Sim, cancelar"
        variant="destructive"
      />
    </>
  );
}
