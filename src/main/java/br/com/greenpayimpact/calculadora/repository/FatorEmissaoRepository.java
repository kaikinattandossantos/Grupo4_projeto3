package br.com.greenpayimpact.calculadora.repository;

import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FatorEmissaoRepository extends JpaRepository<FatorEmissao, Long> {
    
    Optional<FatorEmissao> findByTipoAndAtivoTrue(TipoTransacao tipo);
    List<FatorEmissao> findAllByOrderByDataVigenciaDesc();
    List<FatorEmissao> findAllByAtivoTrue();
}