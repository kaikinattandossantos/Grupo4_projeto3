package br.com.greenpayimpact.calculadora.repository;

import br.com.greenpayimpact.calculadora.model.FatorConversaoAnalogia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FatorConversaoAnalogiaRepository extends JpaRepository<FatorConversaoAnalogia, Long> {
    
    Optional<FatorConversaoAnalogia> findByNomeMetrica(String nomeMetrica);
}