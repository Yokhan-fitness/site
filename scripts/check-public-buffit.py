#!/usr/bin/env python3
"""Smoke-check public BUFF IT landing pages, assets, and data maps."""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen


DEFAULT_BASE_URL = "https://yokhanfitness.ru/"
GUIDE_DOC_URL = "https://guide.yokhanfitness.ru/WarmingUp/about-guide/"
FIRST_AID_DOC_URL = "/health/first-aid/docs/"
MEDKIT_URL = "/health/medkit/"
BACK_PROGRAM_URL = "program-healthy-back.html"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 Chrome/125 Safari/537.36"
)


@dataclass(frozen=True)
class PageCheck:
    path: str
    markers: tuple[str, ...]


@dataclass(frozen=True)
class ServiceCheck:
    name: str
    url: str
    expected_status: tuple[int, ...]
    content_type: str
    markers: tuple[str, ...] = ()


HTML_CHECKS = (
    PageCheck(
        "index.html",
        (
            "BUFF IT FOOD",
            "BUFF IT GUIDE",
            "BUFF IT GATES",
            "https://app.yokhanfitness.ru/services/gates?request=1",
            GUIDE_DOC_URL,
            FIRST_AID_DOC_URL,
            BACK_PROGRAM_URL,
        ),
    ),
    PageCheck("account.html", ("GATES", "https://yokhanfitness.ru/dayflow/")),
    PageCheck("account.html", ("BUFF IT ID", "Один вход", "SmartCart", "CALLS")),
    PageCheck("programs.html", ("\u0427\u0442\u043e \u043c\u043e\u0436\u043d\u043e \u043f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c \u0434\u043e \u0441\u0442\u0430\u0440\u0442\u0430",)),
    PageCheck("coaching.html", ("Фитнес-тренер онлайн — Игорь Назаров", "32 000", "48 000", "buffit_coaching", "b01-06d-trainer-calibration-ceramic", "Профессиональная переподготовка, 333 часа")),
    PageCheck(
        "coach/",
        (
            'href="https://yokhanfitness.ru/coach/"',
            "Помогаю людям за компьютером привести тело в порядок",
            "/coaching.html?from=coach",
            "До&nbsp;фитнеса я&nbsp;учился на&nbsp;компьютерные системы",
            "Прошёл профессиональную переподготовку",
            "b01-06d-trainer-calibration-ceramic-mobile-v7-800.webp",
            "медицинская диагностика",
        ),
    ),
    PageCheck("training.html", ("\u041f\u043e\u0447\u0435\u043c\u0443 \u043d\u0435 \u043c\u0430\u0440\u0430\u0444\u043e\u043d",)),
    PageCheck("method.html", ("\u041d\u0430\u0443\u0447\u043d\u0430\u044f \u0440\u0430\u043c\u043a\u0430", "WHO physical activity")),
    PageCheck(
        "guide.html",
        (
            '<base href="/">',
            GUIDE_DOC_URL,
            "id=\"guide-content\"",
            "\u0427\u0438\u0442\u0430\u0442\u044c \u0433\u0430\u0439\u0434",
        ),
    ),
    PageCheck("app.html", ("\u0414\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0430",)),
    PageCheck("health.html", ("\u041d\u0435 \u0441\u0442\u0430\u0432\u0438\u0442 \u0434\u0438\u0430\u0433\u043d\u043e\u0437", "HEALTH \u043d\u0443\u0436\u0435\u043d")),
    PageCheck("safety.html", (FIRST_AID_DOC_URL, MEDKIT_URL)),
)

JSON_CHECKS = (
    PageCheck("data/proof-map.json", ("sources", "assets", "routeProof")),
    PageCheck("data/cta-map.json", ("coreCtas", "programCtas", "postBotRoutes")),
    PageCheck("data/product-matrix.json", ("routes",)),
    PageCheck("data/program-catalog.json", ("programs",)),
    PageCheck("data/tool-map.json", ("tools",)),
    PageCheck("data/sso-map.json", ("issuer", "smartcart-web", "yokhan-callservice-web")),
)

ASSET_CHECKS = (
    PageCheck("assets/buffit-hero-home-training.png", ("image/png",)),
    PageCheck("assets/igor-nazarov.jpg", ("image/jpeg",)),
    PageCheck("assets/generated/web/b01-01-home-route-expedition-ceramic-desktop-v4-1600.avif", ("image/avif",)),
    PageCheck("assets/generated/web/b01-06d-trainer-calibration-ceramic-mobile-v7-800.webp", ("image/webp",)),
)

GUIDE_LINK_PAGES = (
    "index.html",
    "programs.html",
    "links.html",
    "guide.html",
    "app.html",
    "start.html",
    "bot.html",
    "ecosystem.html",
    "nutrition.html",
    "safety.html",
    "self-training.html",
)

SERVICE_CHECKS = (
    ServiceCheck(
        "auth-discovery",
        "https://auth.yokhanfitness.ru/realms/yokhan/.well-known/openid-configuration",
        (200,),
        "application/json",
        ("issuer", "authorization_endpoint"),
    ),
    ServiceCheck(
        "smartcart",
        "https://smartcart.yokhanfitness.ru/welcome",
        (200,),
        "text/html",
    ),
    ServiceCheck(
        "callservice",
        "https://callservice.yokhanfitness.ru/auth/callback",
        (200,),
        "text/html",
    ),
    ServiceCheck(
        "guide",
        "https://guide.yokhanfitness.ru/",
        (200,),
        "text/html",
        ("__docusaurus", "\u041d\u043e\u0432\u0430\u044f \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043a\u0443\u043b\u044c\u0442\u0443\u0440\u0430"),
    ),
    ServiceCheck(
        "guide-about-doc",
        GUIDE_DOC_URL,
        (200,),
        "text/html",
        ("__docusaurus", "\u041a\u0430\u043a \u0443\u0441\u0442\u0440\u043e\u0435\u043d \u044d\u0442\u043e\u0442 \u0433\u0430\u0439\u0434"),
    ),
    ServiceCheck(
        "guide-nested-doc",
        "https://guide.yokhanfitness.ru/Tools/everyday-activity/",
        (200,),
        "text/html",
        ("__docusaurus", "\u041f\u043e\u0432\u0441\u0435\u0434\u043d\u0435\u0432\u043d\u0430\u044f \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u044c"),
    ),
    ServiceCheck(
        "first-aid-docs",
        "https://yokhanfitness.ru/health/first-aid/docs/",
        (200,),
        "text/html",
        ("__docusaurus",),
    ),
    ServiceCheck(
        "medkit-docs",
        "https://yokhanfitness.ru/health/medkit/docs/",
        (200,),
        "text/html",
        ("__docusaurus",),
    ),
    ServiceCheck("telegram-entry", "https://telegram.yokhanfitness.ru/", (200,), "text/html"),
    ServiceCheck("app-live", "https://app.yokhanfitness.ru/", (200,), "text/html"),
    ServiceCheck("cloak-jump", "https://cloak.yokhanfitness.ru/", (200,), "text/html"),
    ServiceCheck("naive-jump", "https://naive.yokhanfitness.ru/", (200,), "text/html"),
)

BANNED_HTML_MARKERS = (
    "3500",
    "4/8/12",
    "Workouts%20with%20injuries",
    "category/\u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043a\u0438-\u043f\u0440\u0438-\u0445\u0440\u043e\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0445-\u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u044f\u0445",
    "firstaid.yokhanfitness.ru",
    "medkit.yokhanfitness.ru",
    "buffit_safety_guide",
    "\u043b\u0438\u0441\u0442 \u043e\u0436\u0438\u0434\u0430\u043d\u0438\u044f",
    "\u043b\u0435\u0447\u0438\u0442",
    "\u0433\u0430\u0440\u0430\u043d\u0442\u0438\u0440\u0443\u0435\u0442",
)

COACH_FORBIDDEN_MARKERS = (
    'href="#"',
    "unpkg.com",
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "<script",
    "<style",
    "style=",
)

COACHING_FORBIDDEN_MARKERS = (
    "32 000",
    "42 000",
    "стартовая цена",
    "на запуске",
    "первые два месяца",
    "5-8к",
    "5–8к",
    "APP / Personal",
    "FOOD / smartcart",
    "Safety-first",
)

FIXED_PRICE_PAGES = (
    "coaching.html",
    "training.html",
    "programs.html",
    "program-athlete-body.html",
    "program-entry-fitness.html",
    "program-flexible-body.html",
    "program-front-hang.html",
    "program-glutes.html",
    "program-healthy-back.html",
    "program-maintain-shape.html",
    "program-new-image.html",
    "program-power-exit.html",
    "program-pull-ups.html",
    "program-weight-loss.html",
)

FIXED_PRICE_FORBIDDEN_MARKERS = (
    "32 000",
    "42 000",
    "\u0441\u0442\u0430\u0440\u0442\u043e\u0432\u0430\u044f \u0446\u0435\u043d\u0430",
    "0 \u20bd \u043d\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0435",
    "\u043f\u043e\u0437\u0436\u0435 \u0441\u0442\u0430\u043d\u0435\u0442 \u043f\u043b\u0430\u0442\u043d\u044b\u043c",
)

CONNECTIVITY_CHECKS = (
    PageCheck(
        "training.html",
        ("coaching.html?from=training", "32 000", "48 000"),
    ),
    PageCheck(
        "nutrition.html",
        ("https://smartcart.yokhanfitness.ru/welcome", "coaching.html?from=food"),
    ),
)

NOT_FOUND_CHECKS = ("coach/__smoke_missing__.js", "start-home", "start-home/")
COACH_HANGING_WORD_PATTERN = re.compile(
    r"(?<![\w-])(?:а|без|в|во|для|до|за|и|из|к|на|над|не|но|о|об|от|по|под|при|с|со|у|я)[ \t\r\n]+", re.IGNORECASE
)


def read_bytes(base_url: str, path: str, timeout: float) -> tuple[int, str, bytes]:
    url = normalize_url(urljoin(base_url, path))
    request = Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urlopen(request, timeout=timeout) as response:
            status = response.status
            content_type = response.headers.get("content-type", "")
            body = response.read()
    except HTTPError as error:
        status = error.code
        content_type = error.headers.get("content-type", "")
        body = error.read()
    return status, content_type, body


def normalize_url(url: str) -> str:
    parts = urlsplit(url)
    path = quote(parts.path, safe="/%")
    query = quote(parts.query, safe="=&?/%:+")
    return urlunsplit((parts.scheme, parts.netloc, path, query, parts.fragment))


def read_text(base_url: str, path: str, timeout: float) -> tuple[int, str, str]:
    status, content_type, body = read_bytes(base_url, path, timeout)
    return status, content_type, body.decode("utf-8")


def assert_markers(body: str, markers: Iterable[str], path: str) -> list[str]:
    return [f"{path}: missing {marker!r}" for marker in markers if marker not in body]


def check_html(base_url: str, timeout: float) -> list[str]:
    failures: list[str] = []
    for check in HTML_CHECKS:
        status, content_type, body = read_text(base_url, check.path, timeout)
        if status != 200:
            failures.append(f"{check.path}: expected 200, got {status}")
        if "text/html" not in content_type:
            failures.append(f"{check.path}: expected text/html, got {content_type!r}")
        failures.extend(assert_markers(body, check.markers, check.path))
        lower_body = body.lower()
        for marker in BANNED_HTML_MARKERS:
            if marker in lower_body:
                failures.append(f"{check.path}: banned marker {marker!r}")
    return failures


def check_json(base_url: str, timeout: float) -> list[str]:
    failures: list[str] = []
    for check in JSON_CHECKS:
        status, content_type, body = read_text(base_url, check.path, timeout)
        if status != 200:
            failures.append(f"{check.path}: expected 200, got {status}")
        if "application/json" not in content_type:
            failures.append(f"{check.path}: expected application/json, got {content_type!r}")
        try:
            json.loads(body)
        except json.JSONDecodeError as error:
            failures.append(f"{check.path}: invalid JSON: {error}")
        failures.extend(assert_markers(body, check.markers, check.path))
    return failures


def check_assets(base_url: str, timeout: float) -> list[str]:
    failures: list[str] = []
    for check in ASSET_CHECKS:
        status, content_type, body = read_bytes(base_url, check.path, timeout)
        if status != 200:
            failures.append(f"{check.path}: expected 200, got {status}")
        for expected_type in check.markers:
            if expected_type not in content_type:
                failures.append(
                    f"{check.path}: expected {expected_type!r}, got {content_type!r}"
                )
        if not body:
            failures.append(f"{check.path}: empty response")
    return failures


def check_guide_link_contract(base_url: str, timeout: float) -> list[str]:
    failures: list[str] = []
    for path in GUIDE_LINK_PAGES:
        status, content_type, body = read_text(base_url, path, timeout)
        if status != 200:
            failures.append(f"{path}: expected 200, got {status}")
            continue
        if "text/html" not in content_type:
            failures.append(f"{path}: expected text/html, got {content_type!r}")
            continue
        if GUIDE_DOC_URL not in body:
            failures.append(f"{path}: missing Docusaurus guide entry link")
        if 'href="guide.html' in body or "href='guide.html" in body:
            failures.append(f"{path}: still links to local guide.html")
    return failures


def check_coach_security_contract(base_url: str, timeout: float) -> list[str]:
    status, content_type, body = read_text(base_url, "coach/", timeout)
    if status != 200 or "text/html" not in content_type:
        return [f"coach/: unexpected response {status} {content_type!r}"]
    failures = [
        f"coach/: forbidden marker {marker!r}"
        for marker in COACH_FORBIDDEN_MARKERS
        if marker in body.lower()
    ]
    visible_source = re.sub(r"<[^>]+>", " ", body.split("<body", 1)[-1])
    if match := COACH_HANGING_WORD_PATTERN.search(visible_source):
        failures.append(f"coach/: hanging short word {match.group(0)!r}")
    if body.count("<section") > 4:
        failures.append("coach/: more than four content sections")
    if body.count('data-cta-id="coach-contact"') != 1:
        failures.append("coach/: personal contact must appear exactly once")
    if "buffit_coach" in body:
        failures.append("coach/: direct bot route bypasses the coaching offer")
    if body.find("/coaching.html?from=coach") > body.find("https://t.me/") >= 0:
        failures.append("coach/: Telegram appears before the coaching offer")
    return failures


def check_coaching_contract(base_url: str, timeout: float) -> list[str]:
    status, content_type, body = read_text(base_url, "coaching.html", timeout)
    if status != 200 or "text/html" not in content_type:
        return [f"coaching.html: unexpected response {status} {content_type!r}"]
    return [
        f"coaching.html: forbidden marker {marker!r}"
        for marker in COACHING_FORBIDDEN_MARKERS
        if marker in body
    ]


def check_service_connectivity_contract(base_url: str, timeout: float) -> list[str]:
    failures: list[str] = []
    for check in CONNECTIVITY_CHECKS:
        status, content_type, body = read_text(base_url, check.path, timeout)
        if status != 200 or "text/html" not in content_type:
            failures.append(f"{check.path}: unexpected response {status} {content_type!r}")
            continue
        failures.extend(assert_markers(body, check.markers, check.path))

    for path in FIXED_PRICE_PAGES:
        status, content_type, body = read_text(base_url, path, timeout)
        if status != 200 or "text/html" not in content_type:
            failures.append(f"{path}: unexpected response {status} {content_type!r}")
            continue
        for marker in FIXED_PRICE_FORBIDDEN_MARKERS:
            if marker in body.lower():
                failures.append(f"{path}: stale price marker {marker!r}")

    for path in ("links.html", "account.html"):
        status, content_type, body = read_text(base_url, path, timeout)
        if status != 200 or "text/html" not in content_type:
            failures.append(f"{path}: unexpected response {status} {content_type!r}")
            continue
        if "photo.yokhanfitness.ru" in body.lower():
            failures.append(f"{path}: unrelated PHOTO service returned to fitness routes")
    return failures


def check_coach_spacing_contract(base_url: str, timeout: float) -> list[str]:
    status, content_type, body = read_text(base_url, "coach/coach.css", timeout)
    if status != 200 or "text/css" not in content_type:
        return [f"coach/coach.css: unexpected response {status} {content_type!r}"]
    failures: list[str] = []
    if "var(--shell-padding-x) * 2" not in body:
        failures.append("coach/coach.css: shared shell inset is missing")
    if "var(--space-lg) * 2" in body:
        failures.append("coach/coach.css: oversized mobile inset returned")
    return failures


def check_not_found_contract(base_url: str, timeout: float) -> list[str]:
    failures: list[str] = []
    for path in NOT_FOUND_CHECKS:
        status, content_type, _ = read_bytes(base_url, path, timeout)
        if status != 404:
            failures.append(f"{path}: expected 404, got {status} {content_type!r}")
    return failures


def check_services(timeout: float) -> list[str]:
    failures: list[str] = []
    for check in SERVICE_CHECKS:
        status, content_type, body = read_bytes(check.url, "", timeout)
        if status not in check.expected_status:
            failures.append(
                f"{check.name}: expected {check.expected_status}, got {status}"
            )
        if check.content_type not in content_type:
            failures.append(
                f"{check.name}: expected {check.content_type!r}, got {content_type!r}"
            )
        text = body.decode("utf-8", errors="replace")
        failures.extend(assert_markers(text, check.markers, check.name))
    return failures


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--timeout", type=float, default=12.0)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    base_url = args.base_url.rstrip("/") + "/"
    try:
        failures = (
            check_html(base_url, args.timeout)
            + check_json(base_url, args.timeout)
            + check_assets(base_url, args.timeout)
            + check_guide_link_contract(base_url, args.timeout)
            + check_coach_security_contract(base_url, args.timeout)
            + check_coaching_contract(base_url, args.timeout)
            + check_service_connectivity_contract(base_url, args.timeout)
            + check_coach_spacing_contract(base_url, args.timeout)
            + check_not_found_contract(base_url, args.timeout)
            + check_services(args.timeout)
        )
    except (HTTPError, URLError, TimeoutError) as error:
        print(f"public_check_failed: {error}")
        return 1

    if failures:
        print("public_check_failed")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"public_check_ok base_url={base_url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
