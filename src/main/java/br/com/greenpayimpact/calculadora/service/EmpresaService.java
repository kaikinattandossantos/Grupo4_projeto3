package br.com.greenpayimpact.calculadora.service;

import br.com.greenpayimpact.calculadora.dto.CalculoRequest;
import br.com.greenpayimpact.calculadora.dto.CalculoResponse;
import br.com.greenpayimpact.calculadora.model.Empresa;
import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import br.com.greenpayimpact.calculadora.repository.EmpresaRepository;
import br.com.greenpayimpact.calculadora.repository.FatorEmissaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private CalculoService calculoService;

    @Autowired
    private FatorEmissaoRepository fatorRepository; 

    public Empresa salvarEmpresa(CalculoRequest request) {
        Empresa empresa = new Empresa();
        empresa.setRazaoSocial(request.getRazaoSocial());
        empresa.setCnpj(request.getCnpj());
        empresa.setEmail(request.getEmail());
        empresa.setQtdTransacoesAnuais(request.getTransacoes());
        
        // CONGELAMENTO DO HISTÓRICO: Pega o fator que está valendo AGORA e salva o ID
        FatorEmissao fatorFisicoAtual = fatorRepository.findByTipoAndAtivoTrue(TipoTransacao.FISICA)
            .orElseThrow(() -> new RuntimeException("Fator físico não configurado."));
        FatorEmissao fatorDigitalAtual = fatorRepository.findByTipoAndAtivoTrue(TipoTransacao.DIGITAL)
            .orElseThrow(() -> new RuntimeException("Fator digital não configurado."));

        empresa.setFatorFisicoId(fatorFisicoAtual.getId());
        empresa.setFatorDigitalId(fatorDigitalAtual.getId());

        return empresaRepository.save(empresa);
    }

    public CalculoResponse calcularImpactoPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada com o ID: " + id));

        if (empresa.getQtdTransacoesAnuais() <= 0) {
            throw new RuntimeException("Volume de transações deve ser maior que zero.");
        }
        
        return calculoService.calcularImpactoHistorico(
            empresa.getQtdTransacoesAnuais(), 
            empresa.getFatorFisicoId(), 
            empresa.getFatorDigitalId()
        );
    }

    public List<Empresa> listarTodas() {
        return empresaRepository.findAll(Sort.by(Sort.Direction.DESC, "criadoEm"));
    }
}