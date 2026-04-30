package br.com.greenpayimpact.calculadora.service;

import br.com.greenpayimpact.calculadora.dto.FatorEmissaoRequest;
import br.com.greenpayimpact.calculadora.dto.FatorEmissaoResponse;
import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.repository.FatorEmissaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FatorEmissaoService {

    @Autowired
    private FatorEmissaoRepository repository;

    @Transactional
    public FatorEmissaoResponse adicionarFator(FatorEmissaoRequest request) {
        // 1. Desativar o fator antigo (se existir) para manter o histórico
        Optional<FatorEmissao> fatorAntigo = repository.findByTipoAndAtivoTrue(request.tipo());
        if (fatorAntigo.isPresent()) {
            FatorEmissao antigo = fatorAntigo.get();
            antigo.setAtivo(false);
            repository.save(antigo);
        }

        // 2. Criar e salvar o novo fator como ativo
        FatorEmissao novoFator = new FatorEmissao();
        novoFator.setTipo(request.tipo());
        novoFator.setValor(request.valor());
        novoFator.setFonteMetodologia(request.fonteMetodologia());
        novoFator.setAtivo(true);

        novoFator = repository.save(novoFator);

        return new FatorEmissaoResponse(novoFator);
    }

    public List<FatorEmissaoResponse> listarHistoricoCompleto() {
        return repository.findAllByOrderByDataVigenciaDesc().stream()
                .map(FatorEmissaoResponse::new)
                .collect(Collectors.toList());
    }

    public List<FatorEmissaoResponse> listarFatoresAtivos() {
        return repository.findAllByAtivoTrue().stream()
                .map(FatorEmissaoResponse::new)
                .collect(Collectors.toList());
    }
}