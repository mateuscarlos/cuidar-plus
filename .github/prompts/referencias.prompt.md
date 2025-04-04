carregarPaciente(id: string): void {
    this.isLoading = true;
    this.error = null;

    this.pacienteService.obterPacientePorId(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (paciente) => {
          if (paciente) {
            // Desserializar o campo 'endereco' se ele for uma string JSON
            if (paciente.endereco && typeof paciente.endereco === 'string') {
              try {
                paciente.endereco = JSON.parse(paciente.endereco);
              } catch (e) {
                console.error('Erro ao desserializar o endereço:', e);
                paciente.endereco = {
                  logradouro: '',
                  rua: '',
                  numero: '',
                  complemento: '',
                  bairro: '',
                  cidade: '',
                  estado: '',
                  cep: ''
                };
              }
            }

            // Garantir que o endereço seja sempre um objeto válido
            paciente.endereco = paciente.endereco || {
              logradouro: '',
              rua: '',
              numero: '',
              complemento: '',
              bairro: '',
              cidade: '',
              estado: '',
              cep: ''
            };

            this.paciente = paciente;
            this.modoVisualizacao = true;

            // Carregar informações de convênio e plano, se disponíveis
            if (paciente.convenio_id) {
              this.convenioService.listarTodos().subscribe(convenios => {
                const convenio = convenios.find(c => c.id === paciente.convenio_id);
                this.convenio = convenio ? convenio.nome : 'Não informado';

                if (paciente.plano_id && paciente.convenio_id) {
                    this.convenioService.obterPorId(paciente.convenio_id).subscribe(planos => {
                    const plano = planos.find(p => p.id === paciente.plano_id);
                    this.plano = plano ? plano.nome : 'Não informado';
                    });
                }
              });
            }
          } else {
            this.error = 'Paciente não encontrado';
            this.modoVisualizacao = false;
          }
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do paciente';
          this.modoVisualizacao = false;
        }
      });
  }

  