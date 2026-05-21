package br.com.greenpayimpact.calculadora.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.greenpayimpact.calculadora.dto.CalculoRequest;
import br.com.greenpayimpact.calculadora.dto.CalculoResponse;
import br.com.greenpayimpact.calculadora.model.Empresa;
import br.com.greenpayimpact.calculadora.model.ResultadoCalculo;
import br.com.greenpayimpact.calculadora.repository.EmpresaRepository;
import br.com.greenpayimpact.calculadora.repository.ResultadoCalculoRepository;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private ResultadoCalculoRepository resultadoRepository;

    @Autowired
    private CalculoService calculoService;

    public Map<String, Object> processarCalculo(CalculoRequest request) {
        Empresa empresa = null;

        if (request.getCnpj() != null) {
            String cnpj = request.getCnpj();
            empresa = empresaRepository.findByCnpj(cnpj).orElse(new Empresa());
            
            empresa.setCnpj(cnpj);
            
            String nome = request.getNomeEmpresa();
            empresa.setNomeEmpresa((nome != null) ? nome : "Empresa " + cnpj);

            String email = request.getEmail();
            empresa.setEmail((email != null) ? email : "contato@" + cnpj + ".com");

            empresa = empresaRepository.save(empresa);
        }

        ResultadoCalculo resultado = calculoService.calcularEPersistirImpacto(request.getTransacoes(), empresa);

        
        Map<String, Object> resposta = new HashMap<>();
        resposta.put("id", resultado.getId());
        resposta.put("empresaId", (empresa != null) ? empresa.getId() : null);
        resposta.put("anonimo", empresa == null);
        return resposta;
    }

    public CalculoResponse buscarResultadoPorId(Long id) {
        ResultadoCalculo resultado = resultadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Resultado da simulação não encontrado com o ID: " + id));
        return calculoService.mapearParaResponse(resultado);
    }

    public List<Map<String, Object>> listarHistoricoSimulacoes() {
        List<ResultadoCalculo> resultados = resultadoRepository.findByEmpresaIsNotNullOrderByDataCalculoDesc();
        
        return resultados.stream().map(res -> {
            Map<String, Object> mapa = new HashMap<>();
            mapa.put("id", res.getId());
            mapa.put("razaoSocial", res.getEmpresa().getNomeEmpresa());
            mapa.put("cnpj", res.getEmpresa().getCnpj());
            mapa.put("criadoEm", res.getDataCalculo());
            return mapa;
        }).collect(Collectors.toList());
    }
}