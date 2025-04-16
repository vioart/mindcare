const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const yaml = require('js-yaml');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(bodyParser.urlencoded({ extended: true }));

function loadQuestions() {
    const filePath = path.join(__dirname, 'data', 'soal.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents);
    return data.questions;
}  

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/kontak', (req, res) => {
    res.render('kontak');
});

app.get('/kuesioner', (req, res) => {
    const questions = loadQuestions(); 
    res.render('kuesioner', { questions });
});

app.get('/materi', (req, res) => {
    res.render('materi');
});

app.get('/tips', (req, res) => {
    res.render('tips');
});

app.post('/hasil', (req, res) => {
    const answers = req.body; // Ambil semua data jawaban dari form
    let totalScore = 0;

    // Menjumlahkan skor dari setiap pertanyaan
    Object.keys(answers).forEach((key) => {
        // Periksa jika kunci diawali dengan 'q' (pertanyaan)
        if (key.startsWith('q')) {
            const answer = parseInt(answers[key] || 0);  // Jika tidak ada pilihan, anggap 0
            totalScore += answer;  // Menambahkan nilai jawaban ke totalScore
        }
    });

    // Tentukan klasifikasi stres berdasarkan skor
    const classification = getStresClassification(totalScore);

    // Kirim data hasil ke halaman hasil.ejs
    res.render('hasil', { classification, totalScore });
});
  
// Fungsi untuk menentukan klasifikasi stres
function getStresClassification(totalScore) {
    if (totalScore >= 200 && totalScore <= 250) {
      return "Tidak Stres";
    } else if (totalScore >= 150 && totalScore <= 199) {
      return "Stres Rendah";
    } else if (totalScore >= 100 && totalScore <= 149) {
      return "Stres Sedang";
    } else if (totalScore >= 50 && totalScore <= 99) {
      return "Stres Tinggi";
    } else if (totalScore >= 1 && totalScore <= 49) {
      return "Sangat Stres";
    } else {
      return "Skor tidak valid.";
    }
}

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
