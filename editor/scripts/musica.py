"""Andamento e melhor trecho de ~88 unidades de cada música, para cortar o vídeo no tempo.

Uso: python scripts/musica.py  → analisa as músicas novas de entrada/extras/musicas/ e guarda
em trabalho/musicas.json (bpm, unidade de 1 ou 2 tempos, início do trecho). As já analisadas
ficam como estão. A detecção às vezes erra o andamento (pega 2/3 ou 1,5x): confira de ouvido e
force com  python scripts/musica.py entrada/extras/musicas/x.mp3=163  (precisa de numpy).
O roteiro do vídeo (em unidades): intro calma 0-16, chegada forte 16-36, calmo 36-44,
subida 44-48, pico 48-64, desce 64-72, fecho 72-88.
"""
import json, subprocess, sys
import numpy as np

SR, HOP, N = 22050, 512, 2048
FR = SR / HOP
MOLDE = [(0, 16, -0.6), (16, 36, 0.4), (36, 44, -0.4), (44, 48, 0.3), (48, 64, 1.0), (64, 72, -0.2), (72, 88, 0.0)]
UNIDADES = 88


def ler(arq):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', arq, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768


def fluxo(x):
    fr = np.lib.stride_tricks.sliding_window_view(x, N)[::HOP] * np.hanning(N)
    S = np.log1p(10 * np.abs(np.fft.rfft(fr, axis=1)))
    f = np.maximum(0, np.diff(S, axis=0)).sum(1)
    f = f - np.convolve(f, np.ones(16) / 16, 'same')
    return np.maximum(f, 0)


def grade(f, bpm_ini, bpm_fim, passo):
    """melhor (bpm, fase em quadros de análise) pelo pente de tempos"""
    melhor = (-1, 0, 0)
    for b in np.arange(bpm_ini, bpm_fim, passo):
        per = 60 / b * FR
        for ph in np.linspace(0, per, 48, endpoint=False):
            idx = np.round(np.arange(ph, len(f) - 1, per)).astype(int)
            s = f[idx].mean()
            if s > melhor[0]:
                melhor = (s, b, ph)
    return melhor[1], melhor[2]


def analisar(arq, forcado=None):
    x = ler(arq)
    dur = len(x) / SR
    f = fluxo(x)
    ac = np.correlate(f, f, 'full')[len(f) - 1:]
    lags = np.arange(len(ac))
    bpms = 60 * FR / np.maximum(lags, 1)
    m = (bpms > 70) & (bpms < 180)
    aprox = bpms[m][np.argmax(ac[m])]
    # o pico da autocorrelação às vezes cai em 2/3 do andamento (swing): testa 1,5x e 2/3
    def razao(b0):
        b, ph = grade(f, b0 - 1.5, b0 + 1.5, 0.05)
        per = 60 / b * FR
        sorte = np.mean([f[np.round(np.arange(p, len(f) - 1, per)).astype(int)].mean() for p in np.linspace(0, per, 20)])
        return f[np.round(np.arange(ph, len(f) - 1, per)).astype(int)].mean() / sorte, b, ph
    if forcado:
        bpm, ph = grade(f, forcado - 0.5, forcado + 0.5, 0.01)
    else:
        _, bpm, ph = max(razao(b0) for b0 in (aprox, aprox * 1.5, aprox / 1.5) if 70 <= b0 <= 180)
    beat = 60 / bpm
    t0 = ph / FR
    # conta em 1 ou 2 tempos por unidade: o que deixar o vídeo mais perto de 55 s
    unidade = min((1, 2), key=lambda u: abs(UNIDADES * u * beat - 55))
    U = beat * unidade
    # tempo forte: o resto mod 4 com mais ataque
    tempos = np.arange(t0, dur, beat)
    forca = np.array([f[min(len(f) - 1, int(round(t * FR)))] for t in tempos])
    forte = int(np.argmax([forca[k::4].mean() for k in range(4)]))
    # energia por unidade
    rms = lambda a, b: float(np.sqrt(np.mean(x[int(a * SR):int(b * SR)] ** 2) + 1e-12))
    mediana = np.median([rms(t, t + U) for t in np.arange(0, dur - U, U)])
    molde = np.concatenate([np.full(b - a, v) for a, b, v in MOLDE])
    melhor = None
    for k in range(forte, len(tempos), 4):
        ini = tempos[k]
        if ini + UNIDADES * U > dur - 0.5:
            break
        e = np.array([rms(ini + i * U, ini + (i + 1) * U) for i in range(UNIDADES)])
        if e.mean() < 0.6 * mediana:
            continue
        r = float(np.corrcoef(e, molde)[0, 1])
        if melhor is None or r > melhor[0]:
            melhor = (r, ini, k)
    r, ini, k = melhor
    # afina o andamento só no trecho escolhido (ao vivo o tempo escorrega)
    a, b = int(ini * FR), int((ini + UNIDADES * U + 1) * FR)
    bpm2, ph2 = grade(f[a:b], bpm - 0.6, bpm + 0.6, 0.01)
    beat2 = 60 / bpm2
    # início = o tempo da grade nova mais perto do início escolhido
    t_loc = a / FR + ph2 / FR
    n = round((ini - t_loc) / beat2)
    ini2 = t_loc + n * beat2
    return {'arquivo': arq, 'dur': round(dur, 2), 'bpm': round(bpm2, 3), 'unidade': unidade, 'inicio': round(ini2, 3), 'corr': round(r, 3), 'bpmGlobal': round(bpm, 2)}


if __name__ == '__main__':
    import glob, os
    SAIDA = 'trabalho/musicas.json'
    feitas = {m['arquivo']: m for m in json.load(open(SAIDA, encoding='utf8'))} if os.path.exists(SAIDA) else {}
    # arquivo=bpm força o andamento (conferido de ouvido) e refaz aquela
    forcadas = dict(a.replace(os.sep, '/').split('=') for a in sys.argv[1:])
    for arq in sorted(glob.glob('entrada/extras/musicas/*.mp3')):
        arq = arq.replace(os.sep, '/')
        if arq in feitas and arq not in forcadas:
            continue
        feitas[arq] = analisar(arq, float(forcadas[arq]) if arq in forcadas else None)
        print(arq, feitas[arq]['bpm'], 'bpm')
    json.dump(list(feitas.values()), open(SAIDA, 'w', encoding='utf8'), indent=1)
