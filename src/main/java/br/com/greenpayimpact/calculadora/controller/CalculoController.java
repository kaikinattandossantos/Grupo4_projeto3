package br.com.greenpayimpact.calculadora.controller;

import br.com.greenpayimpact.calculadora.dto.CalculoRequest;
import br.com.greenpayimpact.calculadora.dto.CalculoResponse;
import br.com.greenpayimpact.calculadora.model.Empresa;
import br.com.greenpayimpact.calculadora.service.EmpresaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class CalculoController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping("/empresas")
    public ResponseEntity<?> cadastrarEmpresa(@RequestBody @Valid CalculoRequest request, BindingResult result) {
        if (result.hasErrors()) {
            String mensagemErro = result.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(Map.of("erro", mensagemErro));
        }

        Empresa empresaSalva = empresaService.salvarEmpresa(request);
        return ResponseEntity.ok(empresaSalva);
    }

    @GetMapping("/calcular-impacto/{id}")
    public ResponseEntity<?> calcularImpacto(@PathVariable Long id) {
        try {
            CalculoResponse response = empresaService.calcularImpactoPorId(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    @GetMapping("/empresas")
    public ResponseEntity<List<Empresa>> listarEmpresas() {
        return ResponseEntity.ok(empresaService.listarTodas());
    }
}