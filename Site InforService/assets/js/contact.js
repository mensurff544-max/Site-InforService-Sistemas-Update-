document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const alertsContainer = document.getElementById('form-alerts');
    const serviceSelect = document.getElementById('service');

    // Pre-fill service from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get('service');

    if (requestedService && serviceSelect) {
        const exists = Array.from(serviceSelect.options).some((opt) => opt.value === requestedService);
        if (exists) {
            serviceSelect.value = requestedService;
        }
    }

    if (!form) return;

    const showAlert = (message, type) => {
        if (!alertsContainer) return;
        alertsContainer.innerHTML = '';
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        alertsContainer.appendChild(alert);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Honeypot spam check
        const honeypot = form.querySelector('[name="website"]');
        if (honeypot && honeypot.value) return;

        if (!form.checkValidity()) {
            showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
            form.reportValidity();
            return;
        }

        const data = new FormData(form);
        const name    = (data.get('name') || '').toString().trim();
        const email   = (data.get('email') || '').toString().trim();
        const phone   = (data.get('phone') || '').toString().trim();
        const company = (data.get('company') || '').toString().trim();
        const service = (data.get('service') || '').toString().trim();
        const message = (data.get('message') || '').toString().trim();

        const lines = [
            'Olá, gostaria de solicitar atendimento da InforService.',
            '',
            `Nome: ${name}`,
            `E-mail: ${email}`,
            phone   ? `Telefone: ${phone}`   : 'Telefone: não informado',
            company ? `Empresa: ${company}`  : 'Empresa: não informada',
            `Serviço: ${service}`,
            '',
            `Mensagem:\n${message}`,
        ];

        const whatsappNumber = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG.whatsapp : '73999605015';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        showAlert('Mensagem preparada no WhatsApp. Conclua o envio na conversa que abriu.', 'success');
    });
});
