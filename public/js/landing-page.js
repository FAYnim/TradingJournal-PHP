document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    const elementsToFadeIn = document.querySelectorAll('.fade-in-element');
    elementsToFadeIn.forEach(el => {
        observer.observe(el);
    });
});
