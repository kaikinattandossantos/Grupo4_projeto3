package br.com.greenpayimpact.calculadora.controller;

import br.com.greenpayimpact.calculadora.dto.CalculoRequest;
import br.com.greenpayimpact.calculadora.dto.ImpactoResposta;
import br.com.greenpayimpact.calculadora.model.Empresa;
import br.com.greenpayimpact.calculadora.repository.EmpresaRepository;
import br.com.greenpayimpact.calculadora.service.CalculoService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class CalculoController {

    @Autowired
    private CalculoService calculoService;

    @Autowired
    private EmpresaRepository empresaRepository;

    @PostMapping("/calcular-impacto")
    public ResponseEntity<?> executarCalculo(@RequestBody @Valid CalculoRequest request, BindingResult result) {
        
        if (result.hasErrors()) {
            String mensagemErro = result.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(Map.of("erro", mensagemErro));
        }

        salvarEmpresa(request);

        ImpactoResposta response = calculoService.calcularImpacto(request.getTransacoes());
        
        return ResponseEntity.ok(response);
    }

    private void salvarEmpresa(CalculoRequest request) {
        Empresa empresa = new Empresa();
        empresa.setRazaoSocial(request.getRazaoSocial());
        empresa.setCnpj(request.getCnpj());
        empresa.setEmail(request.getEmail());
        empresa.setQtdTransacoesAnuais(request.getTransacoes());
        
        empresaRepository.save(empresa);
    }
}