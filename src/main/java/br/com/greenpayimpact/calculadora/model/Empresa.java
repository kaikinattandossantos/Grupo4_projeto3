package br.com.greenpayimpact.calculadora.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "empresas")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Razão social é obrigatória")
    @Column(nullable = false)
    private String razaoSocial;

    @NotNull(message = "Quantidade de transações é obrigatória")
    @Column(nullable = false)
    private Long qtdTransacoesAnuais;

    private String cnpj;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}