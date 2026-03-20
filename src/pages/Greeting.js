import { el, mount } from '../utils/dom.js';
import storage from '../services/storage.js';
import { Donation } from '../components/Donation.js';


export const Greeting = ({ slug }) => {
    const data = storage.getBySlug(slug);

    if (!data) {
        return el('div', { className: 'card', style: { textAlign: 'center', marginTop: '4rem' } }, [
            el('h2', {}, 'Afwan! Ucapan tidak ditemukan'),
            el('p', { className: 'label' }, 'Mungkin link sudah kedaluwarsa atau terjadi kesalahan.'),
            el('button', { 
                className: 'btn btn-primary', 
                onclick: () => window.router.navigate('/') 
            }, 'Syiarkan Ucapan Baru')
        ]);
    }

    const greetingText = `Selamat Hari Raya Idul Fitri 1447 H 🌙✨

Taqabbalallahu minna wa minkum, shiyamana wa shiyamakum. Semoga Allah SWT menerima segala amal ibadah kita selama bulan Ramadan.

Di hari yang suci ini, mari kita sucikan hati, perbaiki diri, dan pererat tali silaturahmi. Mohon maaf lahir dan batin atas segala khilaf, baik yang disengaja maupun tidak disengaja.

Semoga kebahagiaan, keberkahan, dan kedamaian senantiasa menyertai kita semua.

Selamat Idul Fitri, semoga kita kembali dalam keadaan fitri 🤍

Dari: ${data.from}
Untuk: ${data.to}
${window.location.origin}`;

    const handleShare = async () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(greetingText)}`;
        
        try {
            // Check if Web Share API is supported
            if (!navigator.share) {
                console.log('Web Share API not supported, using WhatsApp link');
                window.open(whatsappUrl, '_blank');
                return;
            }

            // Attempt to share with file if supported
            if (navigator.canShare) {
                try {
                    const response = await fetch(data.image);
                    const blob = await response.blob();
                    const file = new File([blob], `idul-fitri-${slug}.png`, { type: 'image/png' });

                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: 'Selamat Idul Fitri 1447 H',
                            text: greetingText
                        });
                        console.log('Shared successfully with file');
                        return;
                    }
                } catch (fileError) {
                    console.warn('File sharing failed or not supported:', fileError);
                    // Continue to text-only share
                }
            }

            // Fallback: Text-only share via Web Share API
            await navigator.share({
                title: 'Selamat Idul Fitri 1447 H',
                text: greetingText
            });
            console.log('Shared successfully with text');

        } catch (error) {
            console.error('Sharing failed:', error);
            // Final fallback to WhatsApp link
            // Using a slight delay to ensure the browser doesn't block the popup
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 100);
        }
    };

    const container = el('div', { className: 'greeting-page' }, [
        el('div', { className: 'card', style: { padding: '1rem', textAlign: 'center' } }, [
            el('h2', { style: { fontSize: '1.5rem', marginBottom: '0.5rem' } }, `Barakallah, Jazaakallahu khair ${data.to}`),
            el('p', { className: 'label', style: { marginBottom: '1.5rem' } }, `Bingkai spesial dari: ${data.from}`),
            
            el('div', { style: { position: 'relative', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow)' } }, [
                el('img', { 
                    src: data.image, 
                    alt: 'Greeting Image',
                    style: { width: '100%', display: 'block' }
                })
            ]),

            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' } }, [
                el('a', { 
                    href: data.image, 
                    download: `greeting-${slug}.png`,
                    className: 'btn btn-primary'
                }, 'Unduh Kartu'),
                el('button', { 
                    className: 'btn btn-outline',
                    style: { borderColor: '#25D366', color: '#25D366' },
                    onclick: handleShare
                }, 'Bagikan ke WA')
            ]),

            el('button', { 
                className: 'btn btn-outline', 
                style: { marginTop: '1rem' },
                onclick: () => window.router.navigate('/')
            }, 'Syiarkan Ucapan Lainnya')
        ]),

        Donation()
    ]);

    return container;
};
