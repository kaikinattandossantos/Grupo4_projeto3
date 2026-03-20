package com.endered.dashboard.service.impl;

import com.endered.dashboard.dto.cartao.CartaoRequestDTO;
import com.endered.dashboard.dto.cartao.CartaoResponseDTO;
import com.endered.dashboard.model.DigitalCard;
import com.endered.dashboard.repository.DigitalCardRepository;
import com.endered.dashboard.service.CartaoService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CartaoServiceImpl implements CartaoService {

    private final DigitalCardRepository repository;

    @Override
    @Transactional
    public CartaoResponseDTO solicitarCartao(CartaoRequestDTO dto) {

        if (repository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Já existe uma solicitação com este e-mail.");
        }

        DigitalCard card = new DigitalCard();

        card.setNome(dto.getNome());
        card.setEmail(dto.getEmail());
        card.setCpf(dto.getCpf());
        card.setTelefone(dto.getTelefone());
        card.setCidade(dto.getCidade());
        card.setEstado(dto.getEstado());
        card.setLatitude(dto.getLatitude());
        card.setLongitude(dto.getLongitude());
        card.setTipoCartao(dto.getTipoCartao());

        DigitalCard saved = repository.save(card);

        // Simulação de aprovação
        saved.setStatus(DigitalCard.StatusSolicitacao.ATIVO);
        saved.setDataAprovacao(LocalDateTime.now());

        DigitalCard atualizado = repository.save(saved);

        return new CartaoResponseDTO(
                atualizado.getId(),
                atualizado.getStatus().name()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<DigitalCard> listarTodos() {
        return repository.findAll();
    }
}