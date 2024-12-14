// Ajustar textarea automáticamente
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.style.overflow = 'hidden';  // Oculta el scroll
    textarea.style.resize = 'none';  // Evita el redimensionamiento manual
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';  // Resetea la altura para recalcular
        this.style.height = this.scrollHeight + 'px';  // Ajusta la altura al contenido
    });
});
