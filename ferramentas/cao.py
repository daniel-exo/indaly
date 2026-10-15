"""O cachorro do Indaly (logo K1b). Gera o SVG usado no app e os ícones PNG."""
import math
LARANJA, AZUL, BRANCO = "#EE8A24", "#14224F", "#FFFFFF"

def cao(gap=LARANJA, olhos="abertos", guirlanda=True):
    """Desenho em viewBox 0 0 100 100, sem fundo. olhos: abertos | fechados | ambos (classes p/ CSS) | piscando."""
    s = (f'<path d="M31 43 L25.5 15 C25.2 13.3 26.8 12.4 28 13.4 L46 28 Z" fill="{BRANCO}" stroke="{BRANCO}" stroke-width="2" stroke-linejoin="round"/>'
         f'<path d="M69 43 L74.5 15 C74.8 13.3 73.2 12.4 72 13.4 L54 28 Z" fill="{BRANCO}" stroke="{BRANCO}" stroke-width="2" stroke-linejoin="round"/>'
         f'<path d="M33 35 L29.5 20 L40 29 Z" fill="{AZUL}" stroke="{AZUL}" stroke-width="1.5" stroke-linejoin="round"/>'
         f'<path d="M67 35 L70.5 20 L60 29 Z" fill="{AZUL}" stroke="{AZUL}" stroke-width="1.5" stroke-linejoin="round"/>'
         f'<path d="M50 25 C65 25 73 36 73 50 C73 63 64 72 50 72 C36 72 27 63 27 50 C27 36 35 25 50 25 Z" fill="{BRANCO}"/>')
    abertos = f'<g class="olho-aberto"><circle cx="41" cy="47" r="3.2" fill="{AZUL}"/><circle cx="59" cy="47" r="3.2" fill="{AZUL}"/></g>'
    fechados = (f'<g class="olho-fechado"><path d="M37.2 46.6 Q41 50.4 44.8 46.6" fill="none" stroke="{AZUL}" stroke-width="2.3" stroke-linecap="round"/>'
                f'<path d="M55.2 46.6 Q59 50.4 62.8 46.6" fill="none" stroke="{AZUL}" stroke-width="2.3" stroke-linecap="round"/></g>')
    piscando = (f'<circle cx="41" cy="47" r="3.2" fill="{AZUL}"/>'
                f'<path d="M55.2 46.6 Q59 50.4 62.8 46.6" fill="none" stroke="{AZUL}" stroke-width="2.3" stroke-linecap="round"/>')
    s += {"abertos": abertos, "fechados": fechados, "ambos": abertos + fechados, "piscando": piscando}[olhos]
    s += (f'<path d="M44.5 56 H55.5 C55.5 60 52.5 62 50 62 C47.5 62 44.5 60 44.5 56 Z" fill="{AZUL}"/>'
          f'<path d="M50 62 V65 M50 65 C48.2 67.2 45.6 67.2 44.2 65.4 M50 65 C51.8 67.2 54.4 67.2 55.8 65.4" fill="none" stroke="{AZUL}" stroke-width="1.9" stroke-linecap="round"/>'
          f'<ellipse cx="50" cy="36" rx="2.7" ry="4.4" fill="{LARANJA}"/>')
    for k in range(9 if guirlanda else 0):
        a = math.pi * k / 8
        x, y = 50 - 24 * math.cos(a), 69 + 17 * math.sin(a)
        s += f'<circle cx="{x:.2f}" cy="{y:.2f}" r="5" fill="{BRANCO}" stroke="{gap}" stroke-width="1.8"/>'
    return s

def icone(tamanho=None, raio=22, escala=1.0, olhos="abertos"):
    """Ícone completo: fundo laranja + cachorro. raio=0 para quadrado cheio; escala<1 para ícone 'maskable'."""
    t = f' width="{tamanho}" height="{tamanho}"' if tamanho else ""
    g = cao(olhos=olhos)
    if escala != 1:
        g = f'<g transform="translate(50 50) scale({escala}) translate(-50 -50)">{g}</g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"{t}><rect width="100" height="100" rx="{raio}" fill="{LARANJA}"/>{g}</svg>'

if __name__ == "__main__":
    import json, sys
    out = sys.argv[1]
    arq = {
        "icon-192.png": (192, icone(raio=22)), "icon-512.png": (512, icone(raio=22)),
        "icon-maskable-512.png": (512, icone(raio=0, escala=0.74)),
        "apple-touch-icon.png": (180, icone(raio=0, escala=0.88)), "favicon-32.png": (32, icone(raio=22)),
        "logo.svg": (0, icone(raio=22)),
    }
    json.dump({k: [v[0], v[1]] for k, v in arq.items()}, open(out, "w"))
    print(json.dumps({"cao": cao(), "ambos": cao(olhos="ambos"), "frase": cao(gap=AZUL),
                      "semGuirlanda": cao(guirlanda=False), "fuso": cao(gap="#0D7A48", olhos="piscando")}))
