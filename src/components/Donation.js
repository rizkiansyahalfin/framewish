import { el } from '../utils/dom.js';

export const Donation = () => {
    const items = [
        { name: 'GoPay', color: '#00aad2', account: '083819802939', qr: '/src/assets/donation/qr-gopay.jpg' },
        { name: 'DANA', color: '#118ee9', account: '083819802939', qr: '/src/assets/donation/qr-dana.jpg' },
        { name: 'Jago', color: '#ffcc00', account: '501962651111' }
    ];

    return el('section', { className: 'donation-section', style: { marginTop: '2rem' } }, [
        el('h3', { style: { fontSize: '1.25rem', marginBottom: '1rem', textAlign: 'center' } }, 'Infaq & Sadaqah Pengembangan App'),
        el('div', {}, items.map(item => {
            const card = el('div', { className: 'donation-card' }, [
                el('div', { className: 'donation-icon', style: { border: `2px solid ${item.color}` } }, [
                   el('span', { style: { fontWeight: 'bold', color: item.color } }, item.name[0])
                ]),
                el('div', { className: 'donation-info' }, [
                    el('h4', {}, item.name),
                    el('p', {}, `Donasi ukhuwah via ${item.name} - ${item.account}`)
                ]),
                el('div', { style: { display: 'flex', gap: '0.5rem', marginLeft: 'auto' } }, [
                    item.qr ? el('button', {
                        className: 'btn btn-outline',
                        style: { padding: '0.25rem 0.75rem', fontSize: '0.75rem', width: 'auto' },
                        onclick: (e) => {
                            const btn = e.target;
                            const cardEl = btn.closest('.donation-card');
                            let qrContainer = cardEl.querySelector('.qr-container');
                            
                            if (qrContainer) {
                                qrContainer.remove();
                            } else {
                                qrContainer = el('div', { className: 'qr-container', style: { width: '100%', marginTop: '1rem', padding: '1.5rem', background: 'white', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 0 20px rgba(0,0,0,0.5)' } }, [
                                    el('img', { src: item.qr, style: { width: '100%', maxWidth: '320px', borderRadius: '0.25rem', display: 'block', margin: '0 auto' } }),
                                    el('p', { style: { color: '#333', fontSize: '0.875rem', marginTop: '0.75rem', fontWeight: 'bold' } }, `Scan QR ${item.name} untuk Donasi`)
                                ]);
                                cardEl.appendChild(qrContainer);
                            }
                        }
                    }, 'QR') : null,
                    el('button', { 
                        className: 'btn btn-outline', 
                        style: { padding: '0.25rem 0.75rem', fontSize: '0.75rem', width: 'auto' },
                        onclick: () => {
                            navigator.clipboard.writeText(item.account);
                            alert(`Nomor ${item.name} berhasil disalin!`);
                        }
                    }, 'Salin')
                ])
            ]);
            return card;
        }))
    ]);
};
