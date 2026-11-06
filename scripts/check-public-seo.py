#!/usr/bin/env python3
"""Verify the public SEO contract for yokhan.xyz."""

from __future__ import annotations

import argparse
import re
import sys
import urllib.error
import urllib.request
import uuid
import xml.etree.ElementTree as element_tree
from dataclasses import dataclass
from pathlib import Path


BASE_URL = "https://yokhan.xyz"
SITEMAP_NAMESPACE = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
EXPECTED_URLS = (
    f"{BASE_URL}/",
    f"{BASE_URL}/coach/",
    f"{BASE_URL}/coaching.html",
    f"{BASE_URL}/training.html",
    f"{BASE_URL}/programs.html",
    f"{BASE_URL}/self-training.html",
    f"{BASE_URL}/program-entry-fitness.html",
    f"{BASE_URL}/program-weight-loss.html",
    f"{BASE_URL}/program-healthy-back.html",
)
EXPECTED_COACHING_H1 = "Фитнес-тренер онлайн — Игорь Назаров"
EXPECTED_COACHING_LASTMOD = "2026-07-21"
EXPECTED_HOME_LASTMOD = "2026-07-21"


@dataclass(frozen=True)
class Response:
    status: int
    content_type: str
    body: bytes


def fetch(url: str) -> Response:
    request = urllib.request.Request(url, headers={"User-Agent": "BUFF-IT-SEO-Smoke/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            return Response(response.status, response.headers.get_content_type(), response.read())
    except urllib.error.HTTPError as error:
        return Response(error.code, error.headers.get_content_type(), error.read())


def get_canonical(html: str) -> str | None:
    match = re.search(
        r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)',
        html,
        flags=re.IGNORECASE,
    )
    return match.group(1) if match else None


def get_title(html: str) -> str | None:
    match = re.search(r"<title>(.*?)</title>", html, flags=re.IGNORECASE | re.DOTALL)
    return re.sub(r"\s+", " ", match.group(1)).strip() if match else None


def get_h1(html: str) -> str | None:
    match = re.search(r"<h1[^>]*>(.*?)</h1>", html, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return None
    text = re.sub(r"<[^>]+>", "", match.group(1))
    return re.sub(r"\s+", " ", text.replace("&nbsp;", " ")).strip()


def get_sitemap_lastmod(root: element_tree.Element, url: str) -> str | None:
    for entry in root.findall("sm:url", SITEMAP_NAMESPACE):
        location = entry.find("sm:loc", SITEMAP_NAMESPACE)
        if location is None or location.text != url:
            continue
        lastmod = entry.find("sm:lastmod", SITEMAP_NAMESPACE)
        return lastmod.text if lastmod is not None else None
    return None


def check(condition: bool, message: str, errors: list[str]) -> None:
    if condition:
        print(f"PASS {message}")
        return
    print(f"FAIL {message}")
    errors.append(message)


def verify_live() -> list[str]:
    errors: list[str] = []
    robots = fetch(f"{BASE_URL}/robots.txt")
    robots_text = robots.body.decode("utf-8", errors="replace")
    check(robots.status == 200, "robots.txt status is 200", errors)
    check(robots.content_type == "text/plain", "robots.txt MIME is text/plain", errors)
    check("<html" not in robots_text.lower(), "robots.txt is not an HTML fallback", errors)
    check(f"Sitemap: {BASE_URL}/sitemap.xml" in robots_text, "robots.txt declares sitemap", errors)

    sitemap = fetch(f"{BASE_URL}/sitemap.xml")
    check(sitemap.status == 200, "sitemap.xml status is 200", errors)
    check(sitemap.content_type in {"application/xml", "text/xml"}, "sitemap.xml MIME is XML", errors)
    try:
        sitemap_root = element_tree.fromstring(sitemap.body)
        sitemap_urls = tuple(node.text for node in sitemap_root.findall("sm:url/sm:loc", SITEMAP_NAMESPACE))
    except element_tree.ParseError:
        sitemap_root = element_tree.Element("invalid")
        sitemap_urls = ()
    check(sitemap_urls == EXPECTED_URLS, "sitemap contains the exact canonical inventory", errors)
    check(
        get_sitemap_lastmod(sitemap_root, f"{BASE_URL}/") == EXPECTED_HOME_LASTMOD,
        "sitemap carries the current homepage lastmod",
        errors,
    )
    check(
        get_sitemap_lastmod(sitemap_root, f"{BASE_URL}/coaching.html") == EXPECTED_COACHING_LASTMOD,
        "sitemap carries the current coaching lastmod",
        errors,
    )

    titles: list[str] = []
    for url in EXPECTED_URLS:
        response = fetch(url)
        html = response.body.decode("utf-8", errors="replace")
        check(response.status == 200, f"{url} status is 200", errors)
        check(response.content_type == "text/html", f"{url} MIME is text/html", errors)
        check(get_canonical(html) == url, f"{url} has matching canonical", errors)
        check("https://buffit.fit" not in html, f"{url} does not expose legacy og:url", errors)
        if url == f"{BASE_URL}/":
            check(
                'href="coaching.html?from=home"' in html
                and "Персональный фитнес-тренер онлайн" in html,
                "indexed homepage links directly to the coaching query owner",
                errors,
            )
        if url.endswith("/coaching.html"):
            check('"@type": "Service"' in html, "coaching exposes Service schema", errors)
            check('"price": "26000"' in html and '"price": "34000"' in html, "coaching schema matches fixed prices", errors)
            check("buffit_coaching_seo" in html, "coaching exposes organic source handoff", errors)
            check("js/coaching-source.js" in html, "coaching loads source handoff script", errors)
            check(get_h1(html) == EXPECTED_COACHING_H1, "coaching H1 owns the fixed search query", errors)
            check("/assets/igor-nazarov.jpg" in html, "coaching shows the real trainer portrait", errors)
            check("Профессиональная переподготовка, 333 часа" in html, "coaching shows verified trainer qualification", errors)
        title = get_title(html)
        check(bool(title), f"{url} has a title", errors)
        if title:
            titles.append(title)

    check(len(titles) == len(set(titles)), "sitemap titles are unique", errors)
    tracking = fetch(f"{BASE_URL}/coaching.html?from=seo_smoke")
    tracking_html = tracking.body.decode("utf-8", errors="replace")
    check(get_canonical(tracking_html) == f"{BASE_URL}/coaching.html", "tracking URL canonicalizes to coaching", errors)

    source_script = fetch(f"{BASE_URL}/js/coaching-source.js")
    source_script_text = source_script.body.decode("utf-8", errors="replace")
    check(source_script.status == 200, "coaching source script status is 200", errors)
    check(source_script.content_type in {"application/javascript", "text/javascript"}, "coaching source script MIME is JavaScript", errors)
    check("buffit_coaching_seo" not in source_script_text, "coaching source value stays in HTML contract", errors)

    missing = fetch(f"{BASE_URL}/seo-smoke-missing-{uuid.uuid4().hex}")
    check(missing.status == 404, "random missing page returns hard 404", errors)
    missing_asset = fetch(f"{BASE_URL}/seo-smoke-missing-{uuid.uuid4().hex}.css")
    check(missing_asset.status == 404, "random missing asset returns hard 404", errors)
    return errors


def verify_local(root: Path) -> list[str]:
    errors: list[str] = []
    robots = (root / "robots.txt").read_text(encoding="utf-8")
    check(f"Sitemap: {BASE_URL}/sitemap.xml" in robots, "local robots declares sitemap", errors)
    sitemap_root = element_tree.parse(root / "sitemap.xml").getroot()
    sitemap_urls = tuple(node.text for node in sitemap_root.findall("sm:url/sm:loc", SITEMAP_NAMESPACE))
    check(sitemap_urls == EXPECTED_URLS, "local sitemap has exact inventory", errors)
    check(
        get_sitemap_lastmod(sitemap_root, f"{BASE_URL}/") == EXPECTED_HOME_LASTMOD,
        "local sitemap carries the current homepage lastmod",
        errors,
    )
    check(
        get_sitemap_lastmod(sitemap_root, f"{BASE_URL}/coaching.html") == EXPECTED_COACHING_LASTMOD,
        "local sitemap carries the current coaching lastmod",
        errors,
    )

    titles: list[str] = []
    for url in EXPECTED_URLS:
        relative = url.removeprefix(f"{BASE_URL}/")
        path = root / ("index.html" if not relative else "coach/index.html" if relative == "coach/" else relative)
        html = path.read_text(encoding="utf-8")
        check(get_canonical(html) == url, f"{path.name} canonical matches", errors)
        check("https://buffit.fit" not in html, f"{path.name} has no legacy og:url", errors)
        if url == f"{BASE_URL}/":
            check(
                'href="coaching.html?from=home"' in html
                and "Персональный фитнес-тренер онлайн" in html,
                "local indexed homepage links directly to the coaching query owner",
                errors,
            )
        if url.endswith("/coaching.html"):
            check('"@type": "Service"' in html, "local coaching exposes Service schema", errors)
            check('"price": "26000"' in html and '"price": "34000"' in html, "local coaching schema matches fixed prices", errors)
            check("buffit_coaching_seo" in html, "local coaching exposes organic source handoff", errors)
            check("js/coaching-source.js" in html, "local coaching loads source handoff script", errors)
            check(get_h1(html) == EXPECTED_COACHING_H1, "local coaching H1 owns the fixed search query", errors)
            check("/assets/igor-nazarov.jpg" in html, "local coaching shows the real trainer portrait", errors)
            check("Профессиональная переподготовка, 333 часа" in html, "local coaching shows verified trainer qualification", errors)
        title = get_title(html)
        check(bool(title), f"{path.name} has a title", errors)
        if title:
            titles.append(title)
    check(len(titles) == len(set(titles)), "local sitemap titles are unique", errors)
    source_script = (root / "js" / "coaching-source.js").read_text(encoding="utf-8")
    check("SEARCH_REFERRER_HOSTS" in source_script, "local coaching source script checks search referrers", errors)
    check("data-organic-href" in source_script, "local coaching source script updates declared links", errors)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, help="check local files instead of the public site")
    args = parser.parse_args()
    errors = verify_local(args.root.resolve()) if args.root else verify_live()
    print(f"SEO contract: {len(errors)} failure(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
