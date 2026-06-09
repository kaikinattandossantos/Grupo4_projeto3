function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        const iframe = modal.querySelector('iframe');
        if (iframe) {
            let src = iframe.src;
            iframe.src = src;
        }
    }
}

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('lp-modal')) {
        fecharModal(event.target.id);
    }
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modaisAbertos = document.querySelectorAll('.lp-modal.show');
        modaisAbertos.forEach(modal => {
            fecharModal(modal.id);
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const opcoesObserver = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visible');
            } else {
                entrada.target.classList.remove('is-visible');
            }
        });
    }, opcoesObserver);

    const elementosFade = document.querySelectorAll('.fade-in-section');
    elementosFade.forEach((elemento) => {
        observer.observe(elemento);
    });
});