#!/usr/bin/env python3
"""Static site integrity checks for formativeunites.us.

Validates, across every HTML page:
  1. every internal href/src/content path resolves to a real file
  2. every #fragment link targets an existing id
  3. <section>/<div> tags are balanced
  4. every JSON-LD block parses
  5. FAQPage schema questions exactly match the visible FAQ questions

Run from the repo root: python3 checks/check_site.py
Exits non-zero on any failure.
"""
import glob
import html
import json
import os
import re
import sys

SITE = "https://www.formativeunites.us"
errors = []
pages = sorted(glob.glob("*.html") + glob.glob("industries/*.html"))

ids = {p: set(re.findall(r'id="([^"]+)"', open(p).read())) for p in pages}

def visible_faq_questions(txt):
    qs = []
    for m in re.finditer(r'<button class="faq__q"[^>]*>(.*?)</button>', txt, re.S):
        q = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", m.group(1))).strip()
        qs.append(html.unescape(q))
    return qs

for p in pages:
    txt = open(p).read()

    # 1 + 2: internal references and anchors
    for m in re.finditer(r'(?:href|src|content|action)="([^"]+)"', txt):
        u = m.group(1)
        if u.startswith(SITE):
            u = u[len(SITE):] or "/"
        if not u.startswith("/") or u.startswith("//"):
            continue
        path, _, frag = u.partition("#")
        path = path.split("?")[0]
        target = p if path in ("", "/") and frag else ("index.html" if path == "/" else path.lstrip("/"))
        if path not in ("", "/") and not os.path.isfile("." + path):
            errors.append(f"{p}: broken internal reference {u}")
        elif frag and target in ids and frag not in ids[target]:
            errors.append(f"{p}: dead anchor {u}")

    # 3: tag balance
    for tag in ("section", "div"):
        o, c = len(re.findall(f"<{tag}[ >]", txt)), txt.count(f"</{tag}>")
        if o != c:
            errors.append(f"{p}: unbalanced <{tag}> ({o} open / {c} close)")

    # 4 + 5: JSON-LD validity and FAQ parity
    schema_qs = []
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', txt, re.S):
        try:
            d = json.loads(b)
        except json.JSONDecodeError as e:
            errors.append(f"{p}: invalid JSON-LD ({e})")
            continue
        for node in d.get("@graph", [d]) if isinstance(d, dict) else []:
            if node.get("@type") == "FAQPage":
                schema_qs = [e["name"] for e in node.get("mainEntity", [])]
    vis_qs = visible_faq_questions(txt)
    if schema_qs and schema_qs != vis_qs:
        errors.append(f"{p}: FAQPage schema questions differ from visible FAQ "
                      f"(schema={len(schema_qs)}, visible={len(vis_qs)})")

# manifest + sitemap referenced files
for f, pattern in [("site.webmanifest", r'"(/[^"]+)"'), ("sitemap.xml", r"<loc>%s(/[^<]*)</loc>" % re.escape(SITE))]:
    if os.path.isfile(f):
        for u in re.findall(pattern, open(f).read()):
            path = u.split("?")[0]
            if path in ("/",):
                continue
            if not os.path.isfile("." + path):
                errors.append(f"{f}: references missing file {u}")

if errors:
    print(f"FAIL — {len(errors)} problem(s):")
    for e in errors:
        print("  " + e)
    sys.exit(1)
print(f"OK — {len(pages)} pages checked: references, anchors, tag balance, JSON-LD, FAQ parity")
