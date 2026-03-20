package com.endered.dashboard.config;

import com.endered.dashboard.model.DigitalCard;
import com.endered.dashboard.repository.DigitalCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DigitalCardRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) return;

        List<DigitalCard> cards = List.of(
            // São Paulo - grande concentração
            card("Ana Lima", "ana@email.com", "111.111.111-11", "(11) 91111-1111", "São Paulo", "SP", -23.5505, -46.6333, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),
            card("Carlos Souza", "carlos@email.com", "222.222.222-22", "(11) 92222-2222", "São Paulo", "SP", -23.5489, -46.6388, DigitalCard.TipoCartao.CARTAO_CORPORATIVO),
            card("Maria Oliveira", "maria@email.com", "333.333.333-33", "(11) 93333-3333", "São Paulo", "SP", -23.5600, -46.6250, DigitalCard.TipoCartao.CARTAO_PRESENTE),
            card("João Santos", "joao@email.com", "444.444.444-44", "(11) 94444-4444", "São Paulo", "SP", -23.5420, -46.6445, DigitalCard.TipoCartao.CARTAO_FIDELIDADE),
            card("Lucia Ferreira", "lucia@email.com", "555.555.555-55", "(11) 95555-5555", "São Paulo", "SP", -23.5530, -46.6180, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),
            card("Pedro Costa", "pedro@email.com", "666.666.666-66", "(11) 96666-6666", "São Paulo", "SP", -23.5480, -46.6320, DigitalCard.TipoCartao.CARTAO_CORPORATIVO),
            card("Fernanda Melo", "fernanda@email.com", "777.777.777-77", "(11) 97777-7777", "São Paulo", "SP", -23.5550, -46.6400, DigitalCard.TipoCartao.CARTAO_PRESENTE),
            card("Roberto Alves", "roberto@email.com", "888.888.888-88", "(11) 98888-8888", "Guarulhos", "SP", -23.4543, -46.5338, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),
            card("Camila Rocha", "camila@email.com", "999.999.999-99", "(11) 99999-9999", "Guarulhos", "SP", -23.4600, -46.5280, DigitalCard.TipoCartao.CARTAO_FIDELIDADE),
            card("Diego Vieira", "diego@email.com", "123.456.789-00", "(11) 91234-5678", "Guarulhos", "SP", -23.4480, -46.5410, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),

            // Rio de Janeiro
            card("Bruna Carvalho", "bruna@email.com", "234.567.890-11", "(21) 92345-6789", "Rio de Janeiro", "RJ", -22.9068, -43.1729, DigitalCard.TipoCartao.CARTAO_PRESENTE),
            card("Thiago Martins", "thiago@email.com", "345.678.901-22", "(21) 93456-7890", "Rio de Janeiro", "RJ", -22.9100, -43.1800, DigitalCard.TipoCartao.CARTAO_CORPORATIVO),
            card("Isabela Cruz", "isabela@email.com", "456.789.012-33", "(21) 94567-8901", "Rio de Janeiro", "RJ", -22.9000, -43.1650, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),
            card("Gabriel Nascimento", "gabriel@email.com", "567.890.123-44", "(21) 95678-9012", "Niterói", "RJ", -22.8833, -43.1036, DigitalCard.TipoCartao.CARTAO_FIDELIDADE),
            card("Larissa Gomes", "larissa@email.com", "678.901.234-55", "(21) 96789-0123", "Niterói", "RJ", -22.8900, -43.1100, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),

            // Belo Horizonte
            card("Marcelo Silva", "marcelo@email.com", "789.012.345-66", "(31) 97890-1234", "Belo Horizonte", "MG", -19.9191, -43.9386, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),
            card("Priscila Araújo", "priscila@email.com", "890.123.456-77", "(31) 98901-2345", "Belo Horizonte", "MG", -19.9250, -43.9300, DigitalCard.TipoCartao.CARTAO_CORPORATIVO),
            card("Rafael Barbosa", "rafael@email.com", "901.234.567-88", "(31) 99012-3456", "Belo Horizonte", "MG", -19.9100, -43.9450, DigitalCard.TipoCartao.CARTAO_PRESENTE),

            // Curitiba
            card("Aline Pinto", "aline@email.com", "012.345.678-99", "(41) 90123-4567", "Curitiba", "PR", -25.4290, -49.2671, DigitalCard.TipoCartao.CARTAO_FIDELIDADE),
            card("Eduardo Ribeiro", "eduardo@email.com", "111.222.333-44", "(41) 91122-3344", "Curitiba", "PR", -25.4350, -49.2730, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),
            card("Juliana Torres", "juliana@email.com", "222.333.444-55", "(41) 92233-4455", "Curitiba", "PR", -25.4200, -49.2600, DigitalCard.TipoCartao.CARTAO_CORPORATIVO),

            // Porto Alegre
            card("Leandro Pereira", "leandro@email.com", "333.444.555-66", "(51) 93344-5566", "Porto Alegre", "RS", -30.0346, -51.2177, DigitalCard.TipoCartao.CARTAO_PRESENTE),
            card("Natália Freitas", "natalia@email.com", "444.555.666-77", "(51) 94455-6677", "Porto Alegre", "RS", -30.0400, -51.2230, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),

            // Salvador
            card("Hugo Mendes", "hugo@email.com", "555.666.777-88", "(71) 95566-7788", "Salvador", "BA", -12.9714, -38.5014, DigitalCard.TipoCartao.CARTAO_FIDELIDADE),
            card("Tatiana Campos", "tatiana@email.com", "666.777.888-99", "(71) 96677-8899", "Salvador", "BA", -12.9800, -38.5100, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),

            // Fortaleza
            card("Vinícius Lopes", "vinicius@email.com", "777.888.999-00", "(85) 97788-9900", "Fortaleza", "CE", -3.7319, -38.5267, DigitalCard.TipoCartao.CARTAO_CORPORATIVO),
            card("Beatriz Moura", "beatriz@email.com", "888.999.000-11", "(85) 98899-0011", "Fortaleza", "CE", -3.7400, -38.5200, DigitalCard.TipoCartao.CARTAO_PRESENTE),

            // Recife
            card("Caio Cardoso", "caio@email.com", "999.000.111-22", "(81) 99900-1122", "Recife", "PE", -8.0476, -34.8770, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),

            // Brasília
            card("Débora Santos", "debora@email.com", "000.111.222-33", "(61) 90011-2233", "Brasília", "DF", -15.7801, -47.9292, DigitalCard.TipoCartao.CARTAO_CORPORATIVO),
            card("Felipe Nunes", "felipe@email.com", "111.333.555-77", "(61) 91133-5577", "Brasília", "DF", -15.7850, -47.9350, DigitalCard.TipoCartao.CARTAO_FIDELIDADE),

            // Manaus
            card("Giovanna Lima", "giovanna@email.com", "222.444.666-88", "(92) 92244-6688", "Manaus", "AM", -3.1190, -60.0217, DigitalCard.TipoCartao.CARTAO_BENEFICIOS),

            // Belém
            card("Henrique Castro", "henrique@email.com", "333.555.777-99", "(91) 93355-7799", "Belém", "PA", -1.4558, -48.5044, DigitalCard.TipoCartao.CARTAO_PRESENTE),

            // Goiânia
            card("Ingrid Ramos", "ingrid@email.com", "444.666.888-00", "(62) 94466-8800", "Goiânia", "GO", -16.6869, -49.2648, DigitalCard.TipoCartao.CARTAO_FIDELIDADE)
        );

        cards.forEach(card -> {
            card.setStatus(DigitalCard.StatusSolicitacao.ATIVO);
            card.setDataAprovacao(LocalDateTime.now().minusDays((long)(Math.random() * 90)));
            card.setDataSolicitacao(card.getDataAprovacao().minusHours((long)(Math.random() * 48)));
        });

        repository.saveAll(cards);
        System.out.println("✅ " + cards.size() + " cartões digitais de demonstração carregados!");
    }

    private DigitalCard card(String nome, String email, String cpf, String tel,
                              String cidade, String estado, double lat, double lon,
                              DigitalCard.TipoCartao tipo) {
        return DigitalCard.builder()
            .nome(nome)
            .email(email)
            .cpf(cpf)
            .telefone(tel)
            .cidade(cidade)
            .estado(estado)
            .latitude(lat)
            .longitude(lon)
            .tipoCartao(tipo)
            .build();
    }
}
