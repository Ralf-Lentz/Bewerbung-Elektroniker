# FAE Recruiting Landingpage

Finale statische Recruiting-Landingpage fuer Elektroniker / Elektroinstallateure (m/w/d) bei FAE Elektrotechnik.

## Start lokal

```bash
cd /Users/ralflentz/Desktop/codex/landingpage-final
python3 -m http.server 8000
```

Dann im Browser oeffnen:

```text
http://localhost:8000
```

Falls Port 8000 belegt ist:

```bash
python3 -m http.server 8001
```

Dann:

```text
http://localhost:8001
```

## Struktur

- `index.html` - finale Landingpage
- `assets/css/style.css` - mobile-first Styling
- `assets/js/main.js` - stabile Interaktionen, Datenschutz-Gate, Counter, Parallax und CTA-Enhancements
- `assets/img/` - optimierte Bildkopien aus den gelieferten Originalassets
- `assets/video/video.mp4` - lokal eingebundenes Teamvideo, ohne externe Videoplattform
- `assets/fonts/` - lokale Orbitron- und Inter-Fonts

## Hinweise fuer Livegang

Die Seite laeuft ohne Build-Tool und ohne externe Abhaengigkeiten. Fuer den Livegang den kompletten Ordnerinhalt auf den Webserver laden. Das Formular nutzt `mailto:` und benoetigt kein Backend.
