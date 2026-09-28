"""Build the local gear recipe index from ao-data/ao-bin-dumps/items.json.

Usage: python scripts/generate_albion_craft_recipes.py /path/to/items.json
Source: https://github.com/ao-data/ao-bin-dumps/blob/master/items.json
Run again after an Albion game update; review changes before publishing.
"""

import json
import re
import sys
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
LOCAL_ITEMS = PROJECT / "public/data/albion_items.json"
OUTPUT = PROJECT / "public/data/albion_craft_recipes.json"
EQUIPMENT_CATEGORIES = {"head", "armors", "shoes", "offhands", "capes", "bags"}
CITY_BONUSES = {
    "axe": "Martlock", "quarterstaff": "Martlock", "froststaff": "Martlock",
    "plate_shoes": "Martlock", "booktype": "Martlock", "shieldtype": "Martlock", "torchtype": "Martlock",
    "crossbow": "Bridgewatch", "dagger": "Bridgewatch", "cursestaff": "Bridgewatch",
    "plate_armor": "Bridgewatch", "cloth_shoes": "Bridgewatch",
    "sword": "Lymhurst", "bow": "Lymhurst", "arcanestaff": "Lymhurst",
    "leather_helmet": "Lymhurst", "leather_shoes": "Lymhurst",
    "hammer": "Fort Sterling", "spear": "Fort Sterling", "holystaff": "Fort Sterling",
    "cloth_armor": "Fort Sterling", "plate_helmet": "Fort Sterling",
    "mace": "Thetford", "naturestaff": "Thetford", "firestaff": "Thetford",
    "leather_armor": "Thetford", "cloth_helmet": "Thetford",
    "knuckles": "Caerleon", "shapeshifterstaff": "Caerleon",
}


def as_list(value):
    if isinstance(value, list):
        return value
    return [value] if isinstance(value, dict) else []


def extract_alternative(requirement):
    if not isinstance(requirement, dict):
        return None
    materials = []
    for material in as_list(requirement.get("craftresource")):
        code = material.get("@uniquename", "")
        count = int(material.get("@count", "0"))
        if not code or count <= 0:
            return None
        materials.append({
            "id": code,
            "count": count,
            "returnable": material.get("@maxreturnamount") != "0",
        })
    if not materials:
        return None
    return {
        "materials": materials,
        "outputCount": int(requirement.get("@amountcrafted", "1")),
        "silverCost": max(0, int(requirement.get("@silver", "0"))),
        "baseFocus": max(0, int(requirement.get("@craftingfocus", "0"))),
    }


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/generate_albion_craft_recipes.py items.json")
    source = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))["items"]
    names = {item["id"]: item["name"] for item in json.loads(LOCAL_ITEMS.read_text(encoding="utf-8"))}
    recipes = []

    for kind in ("weapon", "transformationweapon", "equipmentitem"):
        for item in as_list(source.get(kind)):
            base_id = item.get("@uniquename", "")
            if not re.match(r"^T[4-8]_", base_id) or "_PROTOTYPE" in base_id:
                continue
            category = item.get("@shopcategory")
            if category != "weapons" and category not in EQUIPMENT_CATEGORIES:
                continue

            variants = [(base_id, 0, item.get("craftingrequirements"))]
            for enchanted in as_list((item.get("enchantments") or {}).get("enchantment")):
                level = int(enchanted.get("@enchantmentlevel", "0"))
                if 1 <= level <= 4:
                    variants.append((f"{base_id}@{level}", level, enchanted.get("craftingrequirements")))

            for item_id, level, requirements in variants:
                alternatives = [entry for entry in (extract_alternative(r) for r in as_list(requirements)) if entry]
                if not alternatives or not all(alt["outputCount"] > 0 for alt in alternatives):
                    continue
                recipes.append({
                    "id": item_id,
                    "name": names.get(base_id, base_id) + (f" .{level}" if level else ""),
                    "category": category,
                    "tier": int(base_id[1]),
                    "bonusCity": ("Brecilien" if category in ("capes", "bags") else CITY_BONUSES.get(item.get("@shopsubcategory1"))),
                    "alternatives": alternatives,
                })

    recipes.sort(key=lambda item: (item["tier"], item["name"], item["id"]))
    OUTPUT.write_text(json.dumps(recipes, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Geradas {len(recipes)} receitas em {OUTPUT}")


if __name__ == "__main__":
    main()
