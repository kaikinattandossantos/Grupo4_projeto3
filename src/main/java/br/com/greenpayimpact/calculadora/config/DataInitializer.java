package br.com.greenpayimpact.calculadora.config;

import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import br.com.greenpayimpact.calculadora.repository.FatorEmissaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FatorEmissaoRepository repository;

    @Override
    public void run(String... args) throws Exception {
        
        if (repository.findByTipoAndAtivoTrue(TipoTransacao.FISICA).isEmpty()) {
            FatorEmissao fatorFisico = new FatorEmissao();
            fatorFisico.setTipo(TipoTransacao.FISICA);
            fatorFisico.setValor(new BigDecimal("0.0005")); 
            fatorFisico.setFonteMetodologia("Padrão Inicial (Pesquisa da Equipe)");
            fatorFisico.setAtivo(true);
            
            repository.save(fatorFisico);
            System.out.println("✅ Fator de Emissão FÍSICA padrão inicializado no banco.");
        }

        if (repository.findByTipoAndAtivoTrue(TipoTransacao.DIGITAL).isEmpty()) {
            FatorEmissao fatorDigital = new FatorEmissao();
            fatorDigital.setTipo(TipoTransacao.DIGITAL);
            fatorDigital.setValor(new BigDecimal("0.00002"));
            fatorDigital.setFonteMetodologia("Padrão Inicial (Pesquisa da Equipe)");
            fatorDigital.setAtivo(true);
            
            repository.save(fatorDigital);
            System.out.println("✅ Fator de Emissão DIGITAL padrão inicializado no banco.");
        }
    }
}