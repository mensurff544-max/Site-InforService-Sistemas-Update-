// XSS-safe analytics renderer — uses textContent / createElement instead of innerHTML for user data
document.addEventListener('DOMContentLoaded', async () => {

    const safeText = (str) => String(str ?? '');

    const createMetricCard = (label, value, suffix) => {
        const article = document.createElement('article');
        article.className = 'info-card';
        const h4 = document.createElement('h4');
        h4.textContent = safeText(label);
        const p = document.createElement('p');
        p.className = 'metric-value';
        p.textContent = safeText(value) + safeText(suffix);
        article.appendChild(h4);
        article.appendChild(p);
        return article;
    };

    const fillList = (elementId, items) => {
        const list = document.getElementById(elementId);
        if (!list || !Array.isArray(items)) return;
        list.innerHTML = '';
        items.forEach(([label, amount]) => {
            const li   = document.createElement('li');
            const span = document.createElement('span');
            const strong = document.createElement('strong');
            span.textContent   = safeText(label);
            strong.textContent = safeText(amount);
            li.appendChild(span);
            li.appendChild(strong);
            list.appendChild(li);
        });
    };

    const buildBarGroup = (day) => {
        const group = document.createElement('div');
        group.className = 'daily-bar-group';

        const bar = document.createElement('div');
        bar.className = 'daily-bar';
        bar.style.height = `${Number(day.bar_pct) || 0}%`;
        bar.title = `${safeText(day.day)}: ${safeText(day.page_views)} pageviews`;

        if (Number(day.lead_submits) > 0) {
            const dot = document.createElement('span');
            dot.className = 'daily-lead-dot';
            dot.title = `${safeText(day.lead_submits)} lead(s)`;
            bar.appendChild(dot);
        }

        const label = document.createElement('span');
        label.className = 'daily-label';
        const d = safeText(day.day);
        label.textContent = `${d.slice(8, 10)}/${d.slice(5, 7)}`;

        group.appendChild(bar);
        group.appendChild(label);
        return group;
    };

    const buildEventRow = (evt) => {
        const tr = document.createElement('tr');
        ['timestamp', 'event', 'page', 'meta'].forEach((key) => {
            const td = document.createElement('td');
            td.textContent = safeText(evt[key]) || '-';
            tr.appendChild(td);
        });
        return tr;
    };

    try {
        const response = await fetch('assets/data/analytics.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        const kpis = document.getElementById('analytics-kpis');
        if (kpis && data.summary) {
            kpis.appendChild(createMetricCard('Total de eventos',        data.summary.total_events));
            kpis.appendChild(createMetricCard('Pageviews',               data.summary.page_views));
            kpis.appendChild(createMetricCard('Cliques em CTA',          data.summary.cta_clicks));
            kpis.appendChild(createMetricCard('Taxa CTA / Pageview',     data.summary.conversion_rate, '%'));
            kpis.appendChild(createMetricCard('Leads enviados',          data.summary.lead_submits));
            kpis.appendChild(createMetricCard('Taxa lead / Pageview',    data.summary.lead_rate, '%'));
        }

        fillList('top-pages',        data.top_pages);
        fillList('top-ctas',         data.top_ctas);
        fillList('leads-by-service', data.leads_by_service);

        const chart = document.getElementById('daily-chart');
        if (chart && Array.isArray(data.daily_activity)) {
            chart.innerHTML = '';
            data.daily_activity.forEach((day) => chart.appendChild(buildBarGroup(day)));
        }

        const recentEvents = document.getElementById('recent-events');
        if (recentEvents && Array.isArray(data.events)) {
            recentEvents.innerHTML = '';
            data.events.forEach((evt) => recentEvents.appendChild(buildEventRow(evt)));
        }

    } catch (error) {
        const kpis = document.getElementById('analytics-kpis');
        if (kpis) {
            const card = document.createElement('article');
            card.className = 'info-card';
            const h4 = document.createElement('h4');
            h4.textContent = 'Falha ao carregar dados';
            const p = document.createElement('p');
            p.textContent = 'Verifique se o arquivo assets/data/analytics.json está disponível.';
            card.appendChild(h4);
            card.appendChild(p);
            kpis.appendChild(card);
        }
        console.error('[analytics]', error);
    }
});
