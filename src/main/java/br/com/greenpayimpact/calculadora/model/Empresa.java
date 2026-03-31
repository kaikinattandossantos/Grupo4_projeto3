package br.com.greenpayimpact.calculadora.model;

import jakarta.persistence.*;
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

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false)
    private Long qtdTransacoesAnuais;

    @Column(nullable = false, length = 14)
    private String cnpj;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}