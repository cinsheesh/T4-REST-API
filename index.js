import express from 'express';
import { daftarArtis } from './src/data/daftarArtis.js';

const app = express();
app.use(express.json());

// Helper: semua error memakai bentuk { error: { pesan, kode } }
const kirimError = (res, status, kode, pesan) =>
    res.status(status).json({ error: { pesan, kode } });

app.get('/', (req, res)=> {
    res.send('Halo dari Express!');
});

app.get('/artis', (req, res)=> {
    const{ tahunRilis } = req.query;
    const hasil = tahunRilis
        ? daftarArtis.filter(a => a.tahunRilis === Number(tahunRilis))
        : daftarArtis;
    res.json({data: hasil, meta: { total: hasil.length}});
});

app.get('/artis/:id', (req, res) => {
    const a = daftarArtis.find(x => x.id === Number(req.params.id));
    if (!a) {
        return kirimError(res, 404, 'NOT_FOUND', 'Artis tidak ditemukan');
    }
    res.json({ data: a });
});

app.delete('/artis/:id', (req, res) => {
    const index = daftarArtis.findIndex(x => x.id === Number(req.params.id));
    if(index === -1){
        return kirimError(res, 404, 'NOT_FOUND', 'Artis tidak ditemukan');
    }
    daftarArtis.splice(index, 1);
    res.status(204).end();
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, (err) => {
    if (err){
        console.error('Gagal menjalankan server:', err.message);
        process.exit(1);
    }
    console.log(`server jalan di http://localhost:${PORT}`);
});