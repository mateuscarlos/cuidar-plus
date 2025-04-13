import { TestBed } from '@angular/core/testing';
import { CepService } from './cep.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Endereco } from '../../features/pacientes/models/endereco.model';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CepService]
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('consultarCep', () => {
    const cepMock = '01001000';
    const enderecoMock: Partial<Endereco> = {
      logradouro: 'Praça da Sé',
      bairro: 'Sé',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01001-000'
    };

    it('should return an endereco when CEP is valid', () => {
      const viaCepResponse = {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
        erro: false
      };

      service.consultarCep(cepMock).subscribe(endereco => {
        expect(endereco?.logradouro).toBe(enderecoMock.logradouro);
        expect(endereco?.bairro).toBe(enderecoMock.bairro);
        expect(endereco?.cidade).toBe(enderecoMock.cidade);
        expect(endereco?.estado).toBe(enderecoMock.estado);
      });

      const req = httpMock.expectOne(`https://viacep.com.br/ws/${cepMock}/json/`);
      expect(req.request.method).toBe('GET');
      req.flush(viaCepResponse);
    });

    it('should handle error when CEP service returns an error flag', () => {
      const viaCepResponse = { erro: true };

      service.consultarCep(cepMock).subscribe({
        next: () => fail('Expected an error, not a successful response'),
        error: error => expect(error.message).toContain('CEP não encontrado')
      });

      const req = httpMock.expectOne(`https://viacep.com.br/ws/${cepMock}/json/`);
      expect(req.request.method).toBe('GET');
      req.flush(viaCepResponse);
    });

    it('should handle invalid CEP format', () => {
      const invalidCep = 'ABC';

      service.consultarCep(invalidCep).subscribe({
        next: () => fail('Expected an error, not a successful response'),
        error: error => expect(error.message).toContain('formato inválido')
      });

      // Não deve fazer requisição HTTP com CEP inválido
      httpMock.expectNone(`https://viacep.com.br/ws/${invalidCep}/json/`);
    });
  });
});