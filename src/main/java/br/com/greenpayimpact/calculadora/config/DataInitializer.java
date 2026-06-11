package br.com.greenpayimpact.calculadora.config;

import br.com.greenpayimpact.calculadora.model.FatorConversaoAnalogia;
import br.com.greenpayimpact.calculadora.model.FatorEmissao;
import br.com.greenpayimpact.calculadora.model.TipoTransacao;
import br.com.greenpayimpact.calculadora.repository.FatorConversaoAnalogiaRepository;
import br.com.greenpayimpact.calculadora.repository.FatorEmissaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private FatorEmissaoRepository emissaoRepository;

    @Autowired
    private FatorConversaoAnalogiaRepository analogiaRepository;

    @Override
    public void run(String... args) throws Exception {
        
        if (emissaoRepository.findByTipoAndAtivoTrue(TipoTransacao.FISICA).isEmpty()) {
            FatorEmissao fatorFisico = new FatorEmissao();
            fatorFisico.setTipo(TipoTransacao.FISICA);
            fatorFisico.setValor(new BigDecimal("0.0005")); 
            fatorFisico.setFonteMetodologia("Padrão Inicial (Pesquisa da Equipe)");
            fatorFisico.setAtivo(true);
            
            emissaoRepository.save(fatorFisico);
            System.out.println("✅ Fator de Emissão FÍSICA inicializado na base de dados.");
        }

        if (emissaoRepository.findByTipoAndAtivoTrue(TipoTransacao.DIGITAL).isEmpty()) {
            FatorEmissao fatorDigital = new FatorEmissao();
            fatorDigital.setTipo(TipoTransacao.DIGITAL);
            fatorDigital.setValor(new BigDecimal("0.00002"));
            fatorDigital.setFonteMetodologia("Padrão Inicial (Pesquisa da Equipe)");
            fatorDigital.setAtivo(true);
            
            emissaoRepository.save(fatorDigital);
            System.out.println("✅ Fator de Emissão DIGITAL inicializado na base de dados.");
        }

        inicializarAnalogia("CO2_POR_ARVORE", "15.0", "kg CO2/árvore", "Estimativa Científica Padrão");
        inicializarAnalogia("CO2_POR_KM", "0.12", "kg CO2/km rodado", "Média Veículo a Combustão");
        inicializarAnalogia("PESO_CARTAO_PVC_KG", "0.005", "kg/cartão", "Média Cartão de PVC");
        inicializarAnalogia("GARRAFAS_POR_KG_PVC", "50", "garrafas/kg", "Média Garrafas PET de 500ml");
    }

    private void inicializarAnalogia(String nome, String valor, String unidade, String fonte) {
        if (analogiaRepository.findByNomeMetrica(nome).isEmpty()) {
            analogiaRepository.save(new FatorConversaoAnalogia(nome, new BigDecimal(valor), unidade, fonte));
            System.out.println("✅ Fator de Conversão de Analogia (" + nome + ") inicializado.");
        }
    }
}