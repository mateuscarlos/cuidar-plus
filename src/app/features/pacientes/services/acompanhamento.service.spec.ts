import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AcompanhamentoService } from './acompanhamento.service';
import { Acompanhamento, TipoAtendimento, MotivoAtendimento, CondicaoPaciente, NivelDor } from '../models/acompanhamento.model';
import { environment } from '../../../../environments/environment';

describe('AcompanhamentoService', () => {
  let service: AcompanhamentoService;
  let httpMock: HttpTestingController;

  const mockAcompanhamento: Acompanhamento = {
    id: '1',
    paciente_id: 1,
    data_hora_atendimento: '2025-04-12T10:00:00',
    tipo_atendimento: TipoAtendimento.PRESENCIAL,
    motivo_atendimento: MotivoAtendimento.ROTINA,
    descricao_motivo: 'Rotina de acompanhamento',
    condicao_paciente: CondicaoPaciente.ESTAVEL,
    descricao_condicao: 'Paciente estável, sem queixas.',
    nivel_dor: NivelDor.SEM_DOR,
    localizacao_dor: '',
    sinais_vitais: {
      pressao_arterial: '120/80',
      frequencia_cardiaca: 72,
      temperatura: 36.5,
      saturacao_oxigenio: 98,
      glicemia: 90
    },
    avaliacao_feridas: {
      aspecto: 'Limpo e seco',
      sinais_infeccao: false,
      tipo_curativo: 'Curativo simples'
    },
    avaliacao_dispositivos: {
      funcionamento_adequado: true,
      sinais_complicacao: ''
    },
    intervencoes: {
      medicacao_administrada: 'Paracetamol 500mg',
      curativo_realizado: 'Curativo simples realizado',
      orientacoes_fornecidas: 'Manter cuidados locais',
      procedimentos_realizados: '',
      outras_intervencoes: ''
    },
    plano_acao: {
      data_proximo: '2025-04-19',
      hora_proximo: '10:00',
      profissional_responsavel: 'Dr. João',
      necessidade_contato_outros: false,
      profissionais_contatar: '',
      necessidade_exames: false,
      exames_consultas: '',
      outras_recomendacoes: 'Manter hidratação e alimentação balanceada'
    },
    comunicacao_cuidador: {
      nome_cuidador: 'Maria',
      informacoes_repassadas: 'Paciente estável, sem queixas.',
      orientacoes_fornecidas: 'Manter cuidados locais',
      duvidas_esclarecidas: 'Sim'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AcompanhamentoService]
    });

    service = TestBed.inject(AcompanhamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar um novo acompanhamento', () => {
    service.criarAcompanhamento(mockAcompanhamento).subscribe(acompanhamento => {
      expect(acompanhamento).toEqual(mockAcompanhamento);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/acompanhamentos`);
    expect(req.request.method).toBe('POST');
    req.flush(mockAcompanhamento);
  });

  it('deve obter um acompanhamento por ID', () => {
    service.obterAcompanhamento('1').subscribe(acompanhamento => {
      expect(acompanhamento).toEqual(mockAcompanhamento);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/acompanhamentos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAcompanhamento);
  });

  it('deve listar acompanhamentos por paciente', () => {
    const mockAcompanhamentos: Acompanhamento[] = [mockAcompanhamento];

    service.obterAcompanhamentosPorPaciente(1).subscribe(acompanhamentos => {
      expect(acompanhamentos).toEqual(mockAcompanhamentos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/acompanhamentos/paciente/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAcompanhamentos);
  });
});