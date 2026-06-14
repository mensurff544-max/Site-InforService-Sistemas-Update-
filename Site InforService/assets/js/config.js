const SITE_CONFIG = Object.freeze({
    whatsapp: '73999605015',
    email: 'contato@inforservicesistemas.site',
    phone: '(73) 9 9960-5015',
    address: 'São Paulo, SP — Brasil',
    businessHours: 'Atendimento 24h',
    get whatsappBase() {
        return `https://wa.me/${this.whatsapp}`;
    },
    get whatsappGreeting() {
        return `${this.whatsappBase}?text=${encodeURIComponent('Olá, gostaria de saber mais sobre os serviços da InforService')}`;
    }
});
