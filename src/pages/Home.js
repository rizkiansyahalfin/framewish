import { el, mount } from '../utils/dom.js';
import { frames } from '../data/frames.js';
import { generateGreetingSlug } from '../utils/slugify.js';
import storage from '../services/storage.js';
import renderer from '../canvas/renderer.js';

export const Home = () => {
    // Load draft from storage
    const draft = storage.getSetting('form_draft') || {
        sender: '',
        receiver: '',
        uploadedImage: null,
        selectedFrameId: frames[0].id
    };

    let selectedFrameId = draft.selectedFrameId;
    let uploadedImage = draft.uploadedImage;

    const saveDraft = () => {
        const sender = document.getElementById('sender')?.value || '';
        const receiver = document.getElementById('receiver')?.value || '';
        storage.setSetting('form_draft', {
            sender,
            receiver,
            uploadedImage,
            selectedFrameId
        });
    };

    const container = el('div', { className: 'home-page' }, [
        el('header', { className: 'glass', style: { padding: '2rem', borderRadius: '0 0 2rem 2rem', marginBottom: '2rem', textAlign: 'center' } }, [
            el('h1', { style: { margin: 0, fontSize: '2rem', background: 'linear-gradient(to right, #6366f1, #ec4899)', webkitBackgroundClip: 'text', webkitTextFillColor: 'transparent' } }, 'Kartu Mubarak'),
            el('p', { className: 'label', style: { marginTop: '0.5rem' } }, 'Syiarkan kebahagiaan Idul Fitri dengan bingkai spesial.')
        ]),

        el('main', { className: 'card' }, [
            el('div', { className: 'input-group' }, [
                el('label', { className: 'label' }, 'Penebar Ukhuwah (Nama Anda)'),
                el('input', { 
                    id: 'sender', 
                    type: 'text', 
                    className: 'input', 
                    placeholder: 'Pemberi Salam',
                    value: draft.sender,
                    oninput: saveDraft
                })
            ]),
            el('div', { className: 'input-group' }, [
                el('label', { className: 'label' }, 'Penerima Berkah (Nama Saudara)'),
                el('input', { 
                    id: 'receiver', 
                    type: 'text', 
                    className: 'input', 
                    placeholder: 'Nama Penerima',
                    value: draft.receiver,
                    oninput: saveDraft
                })
            ]),

            el('div', { className: 'input-group' }, [
                el('label', { className: 'label' }, 'Foto Spesial'),
                el('div', { 
                    className: 'upload-zone', 
                    onclick: () => document.getElementById('file-input').click() 
                }, [
                    el('div', { id: 'preview-container', style: { display: uploadedImage ? 'block' : 'none', marginBottom: '1rem' } }, [
                        el('img', { 
                            id: 'image-preview', 
                            src: uploadedImage || '',
                            style: { width: '100px', height: '100px', borderRadius: '0.5rem', objectFit: 'cover' } 
                        })
                    ]),
                    el('div', { id: 'upload-placeholder', style: { display: uploadedImage ? 'none' : 'block' } }, [
                        el('p', {}, 'Pilih atau drop foto di sini'),
                        el('span', { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }, 'Format JPG/PNG (Max 5MB)')
                    ]),
                    el('input', { 
                        id: 'file-input', 
                        type: 'file', 
                        accept: 'image/*', 
                        style: { display: 'none' },
                        onchange: (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    uploadedImage = event.target.result;
                                    document.getElementById('image-preview').src = uploadedImage;
                                    document.getElementById('preview-container').style.display = 'block';
                                    document.getElementById('upload-placeholder').style.display = 'none';
                                    saveDraft();
                                };
                                reader.readAsDataURL(file);
                            }
                        }
                    })
                ])
            ]),

            el('div', { className: 'input-group' }, [
                el('label', { className: 'label' }, 'Pilih Bingkai'),
                el('div', { className: 'frame-grid' }, 
                    frames.map(frame => {
                        const frameEl = el('div', { 
                            className: `frame-item ${frame.id === selectedFrameId ? 'active' : ''}`,
                            onclick: function() {
                                document.querySelectorAll('.frame-item').forEach(i => i.classList.remove('active'));
                                this.classList.add('active');
                                selectedFrameId = frame.id;
                                saveDraft();
                            }
                        }, [
                            el('img', { src: frame.thumbnail, alt: frame.name })
                        ]);
                        return frameEl;
                    })
                )
            ]),

            el('button', { 
                className: 'btn btn-primary', 
                style: { marginTop: '1rem' },
                onclick: async (e) => {
                    const sender = document.getElementById('sender').value;
                    const receiver = document.getElementById('receiver').value;
                    const btn = e.target;

                    if (!sender || !receiver || !uploadedImage) {
                        alert('Mohon lengkapi semua data!');
                        return;
                    }

                    btn.disabled = true;
                    btn.textContent = 'Menyiapkan Keberkahan...';

                    try {
                        const frame = frames.find(f => f.id === selectedFrameId);
                        const resultImage = await renderer.generate(uploadedImage, frame.overlay);
                        
                        // Add timestamp to slug to avoid duplicate key issues in LocalStorage
                        const slugBase = generateGreetingSlug(sender, receiver);
                        const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;
                        
                        storage.save({
                            from: sender,
                            to: receiver,
                            image: resultImage,
                            slug: slug
                        });

                        // Clear draft after success
                        storage.setSetting('form_draft', null);

                        window.router.navigate(`/ucapan/${slug}`);
                    } catch (err) {
                        alert('Mohon maaf, terjadi kesalahan. Silakan ikhtiar lagi.');
                        console.error(err);
                        btn.disabled = false;
                        btn.textContent = 'Ikhtiar Lagi';
                    }
                }
            }, 'Kirimkan Ucapan Mubarak')
        ])
    ]);

    return container;
};
