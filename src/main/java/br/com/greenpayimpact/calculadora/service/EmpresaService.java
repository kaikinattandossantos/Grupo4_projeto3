package br.com.greenpayimpact.calculadora.service;

import br.com.greenpayimpact.calculadora.dto.CalculoRequest;
import br.com.greenpayimpact.calculadora.dto.CalculoResponse;
import br.com.greenpayimpact.calculadora.model.Empresa;
import br.com.greenpayimpact.calculadora.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private CalculoService calculoService;

    public Empresa salvarEmpresa(CalculoRequest request) {
        Empresa empresa = new Empresa();
        empresa.setRazaoSocial(request.getRazaoSocial());
        empresa.setCnpj(request.getCnpj());
        empresa.setEmail(request.getEmail());
        empresa.setQtdTransacoesAnuais(request.getTransacoes());
        
        return empresaRepository.save(empresa);
    }

    public CalculoResponse calcularImpactoPorId(Long id) {
        Empresa empresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa não encontrada com o ID: " + id));

        if (empresa.getQtdTransacoesAnuais() <= 0) {
            throw new RuntimeException("Volume de transações deve ser maior que zero.");
        }
        
        return calculoService.calcularImpacto(empresa.getQtdTransacoesAnuais());
    }
}