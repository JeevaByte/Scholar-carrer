import csv
import html
import json
from pathlib import Path
from typing import Any

BASE = Path('/Users/jeevananthambalakrishnan/Documents/scholarship_finder')
TOP50_CSV = BASE / 'top50_uk_universities_2026.csv'
OUTPUT_JSON = BASE / 'top50_scholarships_2026_27.json'
OUTPUT_CSV = BASE / 'top50_scholarships_2026_27.csv'
OUTPUT_HTML = BASE / 'top50_scholarships_2026_27.html'

SOURCE_FILES = [
    BASE / 'university_of_manchester_scholarships_2026_27.json',
    BASE / 'manual_json' / 'university_of_oxford.json',
    BASE / 'manual_json' / 'lse.json',
    BASE / 'manual_json' / 'warwick.json',
    BASE / 'manual_json' / 'lancaster.json',
    Path('/Users/jeevananthambalakrishnan/Library/Application Support/Code/User/workspaceStorage/08954fda070b192b6a5c591546319a9d/GitHub.copilot-chat/chat-session-resources/baec0fe5-a817-44a5-b045-72f81dbfa644/call_Qnl9xL0KelpKjGij5qSaBtSJ__vscode-1777676536615/content.txt'),
    Path('/Users/jeevananthambalakrishnan/Library/Application Support/Code/User/workspaceStorage/08954fda070b192b6a5c591546319a9d/GitHub.copilot-chat/chat-session-resources/baec0fe5-a817-44a5-b045-72f81dbfa644/call_yweYoZn4rrEaA1lS50Ac2tZ0__vscode-1777676536618/content.txt'),
    Path('/Users/jeevananthambalakrishnan/Library/Application Support/Code/User/workspaceStorage/08954fda070b192b6a5c591546319a9d/GitHub.copilot-chat/chat-session-resources/baec0fe5-a817-44a5-b045-72f81dbfa644/call_sekZSHLlJk7QrTvYbcZogHmJ__vscode-1777676536619/content.txt'),
    Path('/Users/jeevananthambalakrishnan/Library/Application Support/Code/User/workspaceStorage/08954fda070b192b6a5c591546319a9d/GitHub.copilot-chat/chat-session-resources/baec0fe5-a817-44a5-b045-72f81dbfa644/call_OJX4HdugaX3CSWpF84FYA0UJ__vscode-1777676536672/content.txt'),
    Path('/Users/jeevananthambalakrishnan/Library/Application Support/Code/User/workspaceStorage/08954fda070b192b6a5c591546319a9d/GitHub.copilot-chat/chat-session-resources/baec0fe5-a817-44a5-b045-72f81dbfa644/call_sMppIdryTw69C0t8H9EPx4aF__vscode-1777676536673/content.txt'),
    Path('/Users/jeevananthambalakrishnan/Library/Application Support/Code/User/workspaceStorage/08954fda070b192b6a5c591546319a9d/GitHub.copilot-chat/chat-session-resources/baec0fe5-a817-44a5-b045-72f81dbfa644/call_tTpUnkX6mFbkNlGBUY3fXGbW__vscode-1777676536674/content.json'),
    Path('/Users/jeevananthambalakrishnan/Library/Application Support/Code/User/workspaceStorage/08954fda070b192b6a5c591546319a9d/GitHub.copilot-chat/chat-session-resources/baec0fe5-a817-44a5-b045-72f81dbfa644/call_jho9YYoKChChJIMzwG7aqVFP__vscode-1777676536716/content.txt'),
]


def parse_boolish(value: Any) -> Any:
    if isinstance(value, bool):
        return value
    if value is None:
        return 'NOT_FOUND'
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        lower = value.strip().lower()
        if lower in {'true', 'yes', 'y'}:
            return True
        if lower in {'false', 'no', 'n'}:
            return False
        if lower == 'not_found':
            return 'NOT_FOUND'
    return 'NOT_FOUND'


def normalize_list(value: Any) -> list[str]:
    if value is None:
        return ['NOT_FOUND']
    if isinstance(value, list):
        items = []
        for item in value:
            items.append(str(item).strip() if str(item).strip() else 'NOT_FOUND')
        return items or ['NOT_FOUND']
    text = str(value).strip()
    return [text if text else 'NOT_FOUND']


def normalize_steps(value: Any) -> str:
    if value is None:
        return 'NOT_FOUND'
    if isinstance(value, list):
        parts = [str(item).strip() for item in value if str(item).strip()]
        return ' | '.join(parts) if parts else 'NOT_FOUND'
    text = str(value).strip()
    return text if text else 'NOT_FOUND'


def normalize_text(value: Any) -> str:
    if value is None:
        return 'NOT_FOUND'
    text = str(value).strip()
    return text if text else 'NOT_FOUND'


def extract_json_block(text: str) -> Any:
    fence_markers = ['```json', '```JSON', '```']
    for marker in fence_markers:
        start = text.find(marker)
        if start != -1:
            after = text.find('\n', start)
            if after != -1:
                end = text.find('```', after + 1)
                if end != -1:
                    candidate = text[after + 1:end].strip()
                    try:
                        return json.loads(candidate)
                    except json.JSONDecodeError:
                        pass
    decoder = json.JSONDecoder()
    best = None
    best_len = -1
    for index, char in enumerate(text):
        if char not in '[{':
            continue
        try:
            obj, end = decoder.raw_decode(text[index:])
        except json.JSONDecodeError:
            continue
        if end > best_len:
            best = obj
            best_len = end
    if best is None:
        raise ValueError('No JSON found')
    return best


def load_objects(path: Path) -> list[dict[str, Any]]:
    text = path.read_text(encoding='utf-8')
    payload = extract_json_block(text)
    if isinstance(payload, list):
        if payload and isinstance(payload[0], dict) and 'university_name' in payload[0]:
            return payload
        return []
    if isinstance(payload, dict):
        return [payload]
    return []


def normalize_scholarship(item: dict[str, Any]) -> dict[str, Any]:
    eligibility = item.get('eligibility', {}) or {}
    application = item.get('application_process', {}) or {}
    return {
        'name': normalize_text(item.get('name')),
        'eligibility': {
            'academic_requirements': normalize_text(eligibility.get('academic_requirements')),
            'minimum_gpa_or_percentage': normalize_text(eligibility.get('minimum_gpa_or_percentage')),
            'english_language_requirement': normalize_text(eligibility.get('english_language_requirement')),
            'course_requirements': normalize_text(eligibility.get('course_requirements')),
            'nationality_restrictions': normalize_text(eligibility.get('nationality_restrictions')),
            'financial_need_required': parse_boolish(eligibility.get('financial_need_required')),
            'other_conditions': normalize_text(eligibility.get('other_conditions')),
        },
        'required_documents': normalize_list(item.get('required_documents')),
        'application_process': {
            'separate_application_required': parse_boolish(application.get('separate_application_required')),
            'auto_considered': parse_boolish(application.get('auto_considered')),
            'application_steps': normalize_steps(application.get('application_steps')),
        },
        'deadline': normalize_text(item.get('deadline')),
        'source_url': normalize_text(item.get('source_url')),
    }


def normalize_university(obj: dict[str, Any]) -> dict[str, Any]:
    scholarships = obj.get('scholarships', []) or []
    freshness = obj.get('data_freshness', {}) or {}
    return {
        'university_name': normalize_text(obj.get('university_name')),
        'scholarships': [normalize_scholarship(item) for item in scholarships if isinstance(item, dict)],
        'data_freshness': {
            'retrieved_on': normalize_text(freshness.get('retrieved_on', '2026-05-02')),
            'confidence': normalize_text(freshness.get('confidence', 'low')),
            'notes': normalize_text(freshness.get('notes')),
        },
    }


def placeholder_university(name: str) -> dict[str, Any]:
    return {
        'university_name': name,
        'scholarships': [],
        'data_freshness': {
            'retrieved_on': '2026-05-02',
            'confidence': 'low',
            'notes': 'Not fully collected in this automated run. Official scholarship data should be gathered from the university funding pages before relying on this entry.'
        }
    }


def load_top50_names() -> list[str]:
    names = []
    with TOP50_CSV.open(newline='', encoding='utf-8') as handle:
        reader = csv.reader(handle)
        for row in reader:
            if len(row) >= 2:
                names.append(row[1])
    return names


def build_dataset() -> list[dict[str, Any]]:
    by_name: dict[str, dict[str, Any]] = {}
    for path in SOURCE_FILES:
        if not path.exists():
            continue
        try:
            for obj in load_objects(path):
                normalized = normalize_university(obj)
                by_name[normalized['university_name']] = normalized
        except Exception:
            continue
    ordered = []
    for name in load_top50_names():
        ordered.append(by_name.get(name, placeholder_university(name)))
    return ordered


def write_json(data: list[dict[str, Any]]) -> None:
    OUTPUT_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')


def write_csv(data: list[dict[str, Any]]) -> None:
    header = [
        'university_name', 'scholarship_name', 'academic_requirements', 'minimum_gpa_or_percentage',
        'english_language_requirement', 'course_requirements', 'nationality_restrictions',
        'financial_need_required', 'other_conditions', 'required_documents',
        'separate_application_required', 'auto_considered', 'application_steps', 'deadline',
        'source_url', 'retrieved_on', 'confidence', 'notes'
    ]
    with OUTPUT_CSV.open('w', newline='', encoding='utf-8') as handle:
        writer = csv.writer(handle)
        writer.writerow(header)
        for uni in data:
            if not uni['scholarships']:
                writer.writerow([
                    uni['university_name'], 'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND',
                    'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND', 'NOT_FOUND',
                    'NOT_FOUND', 'NOT_FOUND', uni['data_freshness']['retrieved_on'],
                    uni['data_freshness']['confidence'], uni['data_freshness']['notes']
                ])
                continue
            for scholarship in uni['scholarships']:
                writer.writerow([
                    uni['university_name'],
                    scholarship['name'],
                    scholarship['eligibility']['academic_requirements'],
                    scholarship['eligibility']['minimum_gpa_or_percentage'],
                    scholarship['eligibility']['english_language_requirement'],
                    scholarship['eligibility']['course_requirements'],
                    scholarship['eligibility']['nationality_restrictions'],
                    scholarship['eligibility']['financial_need_required'],
                    scholarship['eligibility']['other_conditions'],
                    ' | '.join(scholarship['required_documents']),
                    scholarship['application_process']['separate_application_required'],
                    scholarship['application_process']['auto_considered'],
                    scholarship['application_process']['application_steps'],
                    scholarship['deadline'],
                    scholarship['source_url'],
                    uni['data_freshness']['retrieved_on'],
                    uni['data_freshness']['confidence'],
                    uni['data_freshness']['notes'],
                ])


def write_html(data: list[dict[str, Any]]) -> None:
    rows = []
    for uni in data:
        if not uni['scholarships']:
            rows.append(
                f"<tr><td>{html.escape(uni['university_name'])}</td><td>NOT_FOUND</td><td>NOT_FOUND</td><td>NOT_FOUND</td><td>NOT_FOUND</td><td>NOT_FOUND</td><td>NOT_FOUND</td><td>{html.escape(uni['data_freshness']['confidence'])}</td><td>{html.escape(uni['data_freshness']['notes'])}</td></tr>"
            )
            continue
        for scholarship in uni['scholarships']:
            rows.append(
                '<tr>'
                f"<td>{html.escape(uni['university_name'])}</td>"
                f"<td>{html.escape(scholarship['name'])}</td>"
                f"<td>{html.escape(scholarship['eligibility']['academic_requirements'])}</td>"
                f"<td>{html.escape(scholarship['eligibility']['nationality_restrictions'])}</td>"
                f"<td>{html.escape(str(scholarship['eligibility']['financial_need_required']))}</td>"
                f"<td>{html.escape(scholarship['application_process']['application_steps'])}</td>"
                f"<td>{html.escape(scholarship['deadline'])}</td>"
                f"<td>{html.escape(uni['data_freshness']['confidence'])}</td>"
                f"<td><a href=\"{html.escape(scholarship['source_url'])}\" target=\"_blank\" rel=\"noopener noreferrer\">source</a></td>"
                '</tr>'
            )
    covered = sum(1 for uni in data if uni['scholarships'])
    html_text = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Top 50 UK Universities Scholarships 2026/27</title>
  <style>
    :root {{ --bg:#f7f9fc; --card:#ffffff; --text:#122230; --muted:#4f6476; --line:#dbe4ec; --accent:#005f73; }}
    body {{ margin:0; font-family:"Segoe UI", Tahoma, Arial, sans-serif; background:var(--bg); color:var(--text); }}
    .wrap {{ max-width: 1400px; margin: 0 auto; padding: 24px; }}
    .meta {{ color: var(--muted); margin-bottom: 16px; }}
    .card {{ background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }}
    .table-wrap {{ overflow-x: auto; }}
    table {{ width: 100%; border-collapse: collapse; font-size: 14px; }}
    th, td {{ border: 1px solid var(--line); padding: 10px; vertical-align: top; text-align: left; }}
    th {{ background: #e8f1f5; white-space: nowrap; }}
    a {{ color: var(--accent); text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Top 50 UK Universities Scholarships (2026/27)</h1>
    <p class="meta">Coverage with scholarship entries: {covered}/50 universities. Remaining entries are placeholders where official data was not fully collected in this run.</p>
    <div class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>University</th>
            <th>Scholarship</th>
            <th>Academic Requirements</th>
            <th>Nationality Restrictions</th>
            <th>Financial Need</th>
            <th>Application Steps</th>
            <th>Deadline</th>
            <th>Confidence</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {''.join(rows)}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
'''
    OUTPUT_HTML.write_text(html_text, encoding='utf-8')


def main() -> None:
    data = build_dataset()
    write_json(data)
    write_csv(data)
    write_html(data)
    print(f'Wrote {OUTPUT_JSON.name}, {OUTPUT_CSV.name}, and {OUTPUT_HTML.name}')


if __name__ == '__main__':
    main()
