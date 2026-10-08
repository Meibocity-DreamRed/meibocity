#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Guangzhou Meibo City - Static Blog Builder
==========================================

Reads Markdown posts from ``content/posts/*.md`` (YAML front matter + Markdown
body), renders the blog listing page (``blog.html``), one page per post
(``blog/<slug>.html``) and regenerates ``sitemap.xml``.

The generated pages reuse the exact ``<header>`` and ``<footer>`` blocks taken
from ``index.html`` so that navigation, language switcher and footer stay in
sync with the rest of the site. Nothing in the existing site is modified by
this script except the two generated artefacts listed above.

Usage:
    python scripts/build_blog.py

Dependencies:
    pip install pyyaml markdown
"""

from __future__ import annotations

import html as html_lib
import re
import sys
from datetime import date, datetime
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("Missing dependency 'pyyaml'. Run: pip install pyyaml markdown")

try:
    import markdown as md_lib
except ImportError:  # pragma: no cover
    sys.exit("Missing dependency 'markdown'. Run: pip install pyyaml markdown")


# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

SITE_URL = "https://meibo-city.com"
SITE_NAME = "Guangzhou Meibo City"
DEFAULT_AUTHOR = "Guangzhou Meibo City"
DEFAULT_DESCRIPTION = (
    "Beauty, hair, cosmetics and salon supply wholesale insights from "
    "Guangzhou Meibo City - China's premier B2B beauty marketplace."
)

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "posts"
BLOG_DIR = ROOT / "blog"
INDEX_HTML = ROOT / "index.html"
SITEMAP_PATH = ROOT / "sitemap.xml"

STATIC_PAGES = ["index.html", "about.html", "products.html", "contact.html", "blog.html"]

MD_EXTENSIONS = ["extra", "tables", "fenced_code"]

FILENAME_RE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})-(.+)$")


# --------------------------------------------------------------------------- #
# Front matter / post loading
# --------------------------------------------------------------------------- #

def split_front_matter(raw: str):
    """Return (front_matter_dict, body_markdown)."""
    text = raw.replace("\r\n", "\n").replace("\r", "\n")
    if text.startswith("\ufeff"):
        text = text[1:]
    if not text.lstrip().startswith("---"):
        return {}, text.strip()

    stripped = text.lstrip("\n")
    # locate closing delimiter
    end = stripped.find("\n---", 3)
    if end == -1:
        return {}, text.strip()

    fm_text = stripped[3:end].strip("\n")
    body = stripped[end + 4:].lstrip("\n")

    try:
        data = yaml.safe_load(fm_text) or {}
    except yaml.YAMLError as exc:
        raise ValueError(f"Invalid YAML front matter: {exc}") from exc
    if not isinstance(data, dict):
        data = {}
    return data, body.rstrip() + "\n"


def parse_date_from_filename(stem: str):
    m = FILENAME_RE.match(stem)
    if not m:
        return None
    year, month, day, _slug = m.groups()
    try:
        return date(int(year), int(month), int(day))
    except ValueError:
        return None


def to_date(value):
    """Coerce a front-matter date value into a datetime.date."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    text = str(value).strip()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(text[: len(fmt) + 2].strip(), fmt).date()
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(text.replace("Z", "")).date()
    except ValueError:
        return None


def plain_text(md_text: str, limit: int = 160) -> str:
    """Very small Markdown -> plain text helper for excerpts / meta descriptions."""
    text = re.sub(r"```.*?```", " ", md_text, flags=re.S)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"^\s{0,3}#{1,6}\s*", "", text, flags=re.M)
    text = re.sub(r"^\s{0,3}>\s?", "", text, flags=re.M)
    text = re.sub(r"^\s{0,3}[-*+]\s+", "", text, flags=re.M)
    text = re.sub(r"^\s{0,3}\d+\.\s+", "", text, flags=re.M)
    text = re.sub(r"[*_~#]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0].rstrip(".,;:") + "..."


class Post:
    def __init__(self, source: Path, meta: dict, body_md: str):
        self.source = source
        stem = source.stem
        self.stem = stem

        self.title = str(meta.get("title") or stem).strip()
        self.author = str(meta.get("author") or DEFAULT_AUTHOR).strip() or DEFAULT_AUTHOR

        parsed = to_date(meta.get("date")) or parse_date_from_filename(stem)
        if parsed is None:
            parsed = datetime.fromtimestamp(source.stat().st_mtime).date()
            print(f"  ! {source.name}: no parsable date, falling back to file mtime")
        self.date = parsed

        cover = meta.get("cover")
        cover = "" if cover is None else str(cover).strip()
        if cover and cover.startswith("assets/"):
            cover = "/" + cover
        self.cover = cover

        excerpt = meta.get("excerpt")
        excerpt = "" if excerpt is None else str(excerpt).strip()
        self.excerpt = excerpt or plain_text(body_md, 160)

        draft_val = meta.get("draft", False)
        if isinstance(draft_val, str):
            self.draft = draft_val.strip().lower() in ("true", "yes", "1")
        else:
            self.draft = bool(draft_val)

        self.body_md = body_md
        self.body_html = md_lib.markdown(body_md, extensions=MD_EXTENSIONS)

    @property
    def slug(self) -> str:
        m = FILENAME_RE.match(self.stem)
        return m.group(4) if m else self.stem

    @property
    def url_path(self) -> str:
        return f"/blog/{self.stem}.html"

    @property
    def display_date(self) -> str:
        return f"{self.date.year}-{self.date.month:02d}-{self.date.day:02d}"

    @property
    def long_date(self) -> str:
        return f"{self.date.strftime('%B')} {self.date.day}, {self.date.year}"


def load_posts() -> list:
    if not POSTS_DIR.is_dir():
        sys.exit(f"Posts directory not found: {POSTS_DIR}")

    posts = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        raw = path.read_text(encoding="utf-8", errors="replace")
        meta, body_md = split_front_matter(raw)
        post = Post(path, meta, body_md)
        if post.draft:
            print(f"  - skipped draft: {path.name}")
            continue
        posts.append(post)

    # newest first; tie-break on filename for a stable order
    posts.sort(key=lambda p: (p.date, p.stem), reverse=True)
    return posts


# --------------------------------------------------------------------------- #
# Header / footer reuse from index.html
# --------------------------------------------------------------------------- #

def extract_block(html_text: str, start_marker: str, end_marker: str) -> str:
    start = html_text.find(start_marker)
    if start == -1:
        sys.exit(f"Could not find '{start_marker}' in {INDEX_HTML.name}")
    end = html_text.find(end_marker, start)
    if end == -1:
        sys.exit(f"Could not find '{end_marker}' after '{start_marker}' in {INDEX_HTML.name}")
    return html_text[start: end + len(end_marker)]


def make_absolute_assets(block: str) -> str:
    """Rewrite relative asset/page references inside header & footer to absolute paths."""
    block = re.sub(r'(src|href)="assets/', r'\1="/assets/', block)
    for page in STATIC_PAGES:
        block = block.replace(f'href="{page}"', f'href="/{page}"')
    return block


def mark_blog_active(block: str) -> str:
    """Move the `active` class onto the Blog nav item for generated blog pages."""
    block = block.replace(
        '<a href="/index.html" class="active" data-i18n="nav.home">',
        '<a href="/index.html" data-i18n="nav.home">',
    )
    block = block.replace(
        '<a href="/blog.html" data-i18n="nav.blog">',
        '<a href="/blog.html" class="active" data-i18n="nav.blog">',
    )
    return block


def load_chrome():
    raw = INDEX_HTML.read_text(encoding="utf-8", errors="replace")
    header = extract_block(raw, '<header class="site-header">', "</header>")
    footer = extract_block(raw, '<footer class="site-footer">', "</footer>")
    header = mark_blog_active(make_absolute_assets(header))
    footer = make_absolute_assets(footer)
    return header, footer


# --------------------------------------------------------------------------- #
# Page rendering
# --------------------------------------------------------------------------- #

def render_page(title: str, description: str, canonical: str, body: str,
                header: str, footer: str, og_type: str = "website",
                jsonld: str = "") -> str:
    title_e = html_lib.escape(title, quote=True)
    desc_e = html_lib.escape(description, quote=True)
    canon_e = html_lib.escape(canonical, quote=True)
    jsonld_block = f"  {jsonld}\n" if jsonld else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{desc_e}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{canon_e}">

  <meta property="og:title" content="{title_e}">
  <meta property="og:description" content="{desc_e}">
  <meta property="og:url" content="{canon_e}">
  <meta property="og:type" content="{og_type}">
  <meta property="og:site_name" content="{SITE_NAME}">
  <meta property="og:locale" content="en_US">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title_e}">
  <meta name="twitter:description" content="{desc_e}">

{jsonld_block}  <title>{title_e}</title>
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="icon" type="image/png" href="/assets/images/favicon.png">
</head>
<body>

{header}

{body}
{footer}

  <script src="/assets/js/i18n.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
"""


def render_article(post: Post, header: str, footer: str) -> str:
    canonical = f"{SITE_URL}{post.url_path}"
    title = f"{post.title} | {SITE_NAME}"

    cover_html = ""
    if post.cover:
        cover_html = (
            f'\n        <img class="post-cover" src="{html_lib.escape(post.cover, quote=True)}" '
            f'alt="{html_lib.escape(post.title, quote=True)}">'
        )

    jsonld = (
        '<script type="application/ld+json">\n'
        "  {\n"
        '    "@context": "https://schema.org",\n'
        '    "@type": "BlogPosting",\n'
        f'    "headline": {_json_str(post.title)},\n'
        f'    "description": {_json_str(post.excerpt)},\n'
        f'    "datePublished": "{post.display_date}",\n'
        f'    "dateModified": "{post.display_date}",\n'
        f'    "author": {{"@type": "Organization", "name": {_json_str(post.author)}}},\n'
        f'    "publisher": {{"@type": "Organization", "name": {_json_str(SITE_NAME)},\n'
        f'      "logo": {{"@type": "ImageObject", "url": "{SITE_URL}/assets/images/logo.png"}}}},\n'
        f'    "mainEntityOfPage": {{"@type": "WebPage", "@id": "{canonical}"}},\n'
        f'    "url": "{canonical}"'
        + (f',\n    "image": "{SITE_URL}{post.cover}"' if post.cover else "")
        + "\n  }\n"
        "  </script>"
    )

    body = f"""  <section class="blog-hero">
    <div class="container">
      <p class="blog-hero-meta">By {html_lib.escape(post.author)} &middot; {post.long_date}</p>
      <h1 class="blog-hero-title">{html_lib.escape(post.title)}</h1>
    </div>
  </section>

  <section class="section-padding">
    <div class="container">
      <article class="post-content">{cover_html}
{post.body_html}      </article>
      <p class="post-back"><a href="/blog.html" data-i18n="blog.back">Back to blog</a></p>
    </div>
  </section>

"""
    return render_page(title, post.excerpt, canonical, body, header, footer,
                       og_type="article", jsonld=jsonld)


def _json_str(value: str) -> str:
    import json
    return json.dumps(value, ensure_ascii=False)


def render_card(post: Post) -> str:
    cover = ""
    if post.cover:
        cover = (
            f'<img src="{html_lib.escape(post.cover, quote=True)}" '
            f'alt="{html_lib.escape(post.title, quote=True)}" loading="lazy">'
        )
    return f"""      <a class="blog-card" href="{post.url_path}">
        <div class="blog-card-cover">{cover}</div>
        <div class="blog-card-body">
          <p class="blog-card-date">{post.long_date}</p>
          <h2 class="blog-card-title">{html_lib.escape(post.title)}</h2>
          <p class="blog-card-excerpt">{html_lib.escape(post.excerpt)}</p>
          <span class="blog-card-more" data-i18n="blog.readmore">Read more</span>
        </div>
      </a>"""


def render_listing(posts: list, header: str, footer: str) -> str:
    canonical = f"{SITE_URL}/blog.html"
    title = f"Blog | {SITE_NAME}"

    if posts:
        cards = "\n".join(render_card(p) for p in posts)
        grid = f'    <div class="blog-grid">\n{cards}\n    </div>'
    else:
        grid = '    <p class="blog-empty" data-i18n="blog.empty">No articles published yet. Please check back soon.</p>'

    jsonld = (
        '<script type="application/ld+json">\n'
        "  {\n"
        '    "@context": "https://schema.org",\n'
        '    "@type": "Blog",\n'
        f'    "name": "Guangzhou Meibo City Blog",\n'
        f'    "url": "{canonical}",\n'
        f'    "description": {_json_str(DEFAULT_DESCRIPTION)},\n'
        '    "blogPost": [\n'
        + ",\n".join(
            f'      {{"@type": "BlogPosting", "headline": {_json_str(p.title)}, '
            f'"url": "{SITE_URL}{p.url_path}", "datePublished": "{p.display_date}"}}'
            for p in posts
        )
        + "\n    ]\n"
        "  }\n"
        "  </script>"
    )

    body = f"""  <section class="blog-hero">
    <div class="container">
      <h1 class="blog-hero-title" data-i18n="blog.title">Blog</h1>
      <p class="blog-hero-meta" data-i18n="blog.subtitle">Insights and sourcing guides for the global beauty wholesale trade.</p>
    </div>
  </section>

  <section class="section-padding">
    <div class="container">
{grid}
    </div>
  </section>

"""
    return render_page(title, DEFAULT_DESCRIPTION, canonical, body, header, footer,
                       og_type="website", jsonld=jsonld)


# --------------------------------------------------------------------------- #
# Sitemap
# --------------------------------------------------------------------------- #

def render_sitemap(posts: list) -> str:
    today = date.today().isoformat()

    def url(loc: str, lastmod: str, changefreq: str, priority: str) -> str:
        return (
            "  <url>\n"
            f"    <loc>{loc}</loc>\n"
            f"    <lastmod>{lastmod}</lastmod>\n"
            f"    <changefreq>{changefreq}</changefreq>\n"
            f"    <priority>{priority}</priority>\n"
            "  </url>"
        )

    entries = [
        url(f"{SITE_URL}/", today, "weekly", "1.0"),
        url(f"{SITE_URL}/about.html", today, "monthly", "0.8"),
        url(f"{SITE_URL}/products.html", today, "monthly", "0.9"),
        url(f"{SITE_URL}/contact.html", today, "monthly", "0.8"),
        url(f"{SITE_URL}/blog.html", today, "weekly", "0.8"),
    ]
    for post in posts:
        entries.append(url(f"{SITE_URL}{post.url_path}", post.display_date, "monthly", "0.6"))

    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #

def main() -> int:
    print(f"Blog build - {SITE_NAME}")
    print(f"  root      : {ROOT}")
    print(f"  posts dir : {POSTS_DIR}")

    print("\n[1/4] Loading posts ...")
    posts = load_posts()
    print(f"  loaded {len(posts)} published post(s)")
    for p in posts:
        print(f"    - {p.display_date}  {p.source.name}")

    print("\n[2/4] Reading header/footer from index.html ...")
    header, footer = load_chrome()
    print("  header and footer extracted")

    print("\n[3/4] Rendering pages ...")
    BLOG_DIR.mkdir(parents=True, exist_ok=True)

    # remove stale generated article pages so deleted/renamed posts don't linger
    for old in BLOG_DIR.glob("*.html"):
        old.unlink()

    listing = render_listing(posts, header, footer)
    (ROOT / "blog.html").write_text(listing, encoding="utf-8", newline="\n")
    print("  wrote blog.html")

    for post in posts:
        page = render_article(post, header, footer)
        target = BLOG_DIR / f"{post.stem}.html"
        target.write_text(page, encoding="utf-8", newline="\n")
        print(f"  wrote blog/{post.stem}.html")

    print("\n[4/4] Writing sitemap.xml ...")
    SITEMAP_PATH.write_text(render_sitemap(posts), encoding="utf-8", newline="\n")
    print(f"  wrote {SITEMAP_PATH.name}")

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
