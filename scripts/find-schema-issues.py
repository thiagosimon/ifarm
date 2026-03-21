import re, glob

files = glob.glob('services/*/src/**/*.schema.ts', recursive=True)
issues = []
for f in sorted(files):
    with open(f) as fh:
        lines = fh.readlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        m = re.match(r'\s+(\w+)\??\s*:\s*(\w+)\s*\|\s*(\w+)\s*;', line)
        if m:
            prop_name = m.group(1)
            ts_type = m.group(2)
            union_part = m.group(3)
            j = i - 1
            prop_decorator_lines = []
            while j >= 0 and j >= i - 10:
                pline = lines[j].rstrip()
                prop_decorator_lines.insert(0, pline)
                if '@Prop' in pline:
                    break
                j -= 1
            prop_block = ' '.join(prop_decorator_lines)
            has_type = bool(re.search(r'type\s*:', prop_block))
            if not has_type:
                issues.append({
                    'file': f,
                    'prop_line': i + 1,
                    'prop_name': prop_name,
                    'ts_type': ts_type + ' | ' + union_part,
                    'decorator': prop_block.strip(),
                    'prop_decl': line.strip()
                })
        i += 1

for iss in issues:
    print('FILE:', iss['file'])
    print('  Line:', iss['prop_line'])
    print('  Property:', iss['prop_name'])
    print('  TS Type:', iss['ts_type'])
    print('  @Prop:', iss['decorator'])
    print('  Declaration:', iss['prop_decl'])
    print()
print('Total issues found:', len(issues))
