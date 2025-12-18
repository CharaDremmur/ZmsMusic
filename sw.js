<script>
const dosya = document.getElementById("dosya");
const player = document.getElementById("player");
const bar = document.getElementById("bar");
const zaman = document.getElementById("zaman");
const ses = document.getElementById("ses");
const playlistUI = document.getElementById("playlist");

let playlist = [];
let index = 0;
let shuffle = false;
let loop = false;

// dosyalar seçildi
dosya.addEventListener("change", () => {
    playlist = Array.from(dosya.files);
    playlistUI.innerHTML = "";
    index = 0;

    playlist.forEach((muzik, i) => {
        const li = document.createElement("li");
        li.textContent = muzik.name;
        li.style.cursor = "pointer";
        li.onclick = () => cal(i);
        playlistUI.appendChild(li);
    });

    cal(0);
});

// çal
function cal(i) {
    index = i;
    player.src = URL.createObjectURL(playlist[index]);
    player.play();
    aktifIsaretle();
}

function oynat() {
    player.play();
}

function durdur() {
    player.pause();
}

// otomatik sonraki
player.addEventListener("ended", () => {

    // LOOP AÇIKSA AYNI ŞARKI
    if (loop) {
        cal(index);
        return;
    }

    // SHUFFLE AÇIKSA RASTGELE
    if (shuffle) {
        let next;
        do {
            next = Math.floor(Math.random() * playlist.length);
        } while (next === index && playlist.length > 1);
        cal(next);
        return;
    }

    // NORMAL
    index++;
    if (index < playlist.length) {
        cal(index);
    }
});

// süre
player.addEventListener("loadedmetadata", () => {
    bar.max = player.duration;
});

player.addEventListener("timeupdate", () => {
    bar.value = player.currentTime;
    zaman.textContent =
        format(player.currentTime) + " / " + format(player.duration);
});

bar.addEventListener("input", () => {
    player.currentTime = bar.value;
});

// ses
ses.addEventListener("input", () => {
    player.volume = ses.value;
});

// aktif şarkı
function aktifIsaretle() {
    [...playlistUI.children].forEach((li, i) => {
        li.style.color = i === index ? "yellow" : "white";
    });
}

// süre format
function format(s) {
    if (isNaN(s)) return "00:00";
    const dk = Math.floor(s / 60);
    const sn = Math.floor(s % 60);
    return dk.toString().padStart(2,"0") + ":" + sn.toString().padStart(2,"0");
}
function shuffleToggle() {
    shuffle = !shuffle;
    document.getElementById("shuffleBtn").style.background =
        shuffle ? "#ffd700" : "white";
}

function loopToggle() {
    loop = !loop;
    document.getElementById("loopBtn").style.background =
        loop ? "#ffd700" : "white";
}
// === EQUALIZER ÇEKİRDEK ===
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

const source = ctx.createMediaElementSource(audio);

// Bass
const bass = ctx.createBiquadFilter();
bass.type = "lowshelf";
bass.frequency.value = 200;

// Mid
const mid = ctx.createBiquadFilter();
mid.type = "peaking";
mid.frequency.value = 1000;
mid.Q.value = 1;

// Treble
const treble = ctx.createBiquadFilter();
treble.type = "highshelf";
treble.frequency.value = 3000;

// Bağlantı
source
  .connect(bass)
  .connect(mid)
  .connect(treble)
  .connect(ctx.destination);

// Play olunca context aç
audio.addEventListener("play", () => {
    if (ctx.state === "suspended") ctx.resume();
});
function eqToggle() {
    document.getElementById("eqPanel").classList.toggle("open");
}

</script>
