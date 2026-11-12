#!/usr/bin/env python3
"""Submit the canonical sitemap inventory to Yandex IndexNow."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as element_tree
from pathlib import Path


ENDPOINT = "https://yandex.com/indexnow"
HOST = "yokhanfitness.ru"
SITEMAP_NAMESPACE = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def get_urls(sitemap_path: Path) -> list[str]:
    root = element_tree.parse(sitemap_path).getroot()
    urls = [node.text for node in root.findall("sm:url/sm:loc", SITEMAP_NAMESPACE)]
    return [url for url in urls if url]


def submit_urls(key_path: Path, sitemap_path: Path) -> int:
    key = key_path.read_text(encoding="utf-8").strip()
    urls = get_urls(sitemap_path)
    payload = json.dumps(
        {
            "host": HOST,
            "key": key,
            "keyLocation": f"https://{HOST}/{key_path.name}",
            "urlList": urls,
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            print(f"indexnow_status={response.status} urls={len(urls)}")
            return 0 if response.status in {200, 202} else 1
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        print(f"indexnow_status={error.code} body={body}", file=sys.stderr)
        return 1


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("key_file", type=Path)
    parser.add_argument("--sitemap", type=Path, default=Path("sitemap.xml"))
    args = parser.parse_args()
    return submit_urls(args.key_file, args.sitemap)


if __name__ == "__main__":
    sys.exit(main())
