# -*- coding: utf-8 -*-
"""Kök kaynak -> dist (yayın paketi). Sunucu kilidini otomatik kaldırır."""
import os, re, shutil, subprocess, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
PAGES = ["index.html", "hizmetler.html", "hakkimizda.html", "projelerimiz.html", "iletisim.html"]
PORT = 8811


def kill_port(port):
    out = subprocess.run(["netstat", "-ano"], capture_output=True, text=True).stdout
    pids = {l.split()[-1] for l in out.splitlines() if f":{port}" in l and "LISTENING" in l}
    for pid in pids:
        subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True)
        print(f"  sunucu durduruldu (PID {pid})")
    time.sleep(1)


def clear_dir(d):
    try:
        shutil.rmtree(d)
        return
    except PermissionError:
        for name in os.listdir(d):
            fp = os.path.join(d, name)
            try:
                clear_dir(fp) if os.path.isdir(fp) else os.remove(fp)
            except OSError as e:
                print("  atlandi:", name, e)
        try:
            os.rmdir(d)
        except OSError:
            pass


kill_port(PORT)
if os.path.isdir(DIST):
    clear_dir(DIST)
for sub in ("css", "js", "images"):
    os.makedirs(os.path.join(DIST, sub), exist_ok=True)

shutil.copy2(os.path.join(ROOT, "css", "style.css"), os.path.join(DIST, "css", "style.css"))
shutil.copy2(os.path.join(ROOT, "js", "main.js"), os.path.join(DIST, "js", "main.js"))
for f in ("favicon.svg", "robots.txt", "sitemap.xml"):
    src = os.path.join(ROOT, f)
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(DIST, f))

imgdir = os.path.join(ROOT, "images")
if os.path.isdir(imgdir):
    for f in os.listdir(imgdir):
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif")):
            shutil.copy2(os.path.join(imgdir, f), os.path.join(DIST, "images", f))

for p in PAGES:
    html = open(os.path.join(ROOT, p), encoding="utf-8").read()
    html = re.sub(r"style\.css\?v=[\d.]+", "style.css?v=2.2", html)
    html = re.sub(r"main\.js\?v=[\d.]+", "main.js?v=2.2", html)
    open(os.path.join(DIST, p), "w", encoding="utf-8", newline="\n").write(html)

total = 0
print("\ndist icerik:")
for root, dirs, files in os.walk(DIST):
    for f in sorted(files):
        fp = os.path.join(root, f)
        sz = os.path.getsize(fp)
        total += sz
        print(f"  {os.path.relpath(fp, DIST):24s} {sz:8d} B")
print(f"  {'TOPLAM':24s} {total:8d} B")
