import os
import re

for root, dirs, files in os.walk('d:/projects/antigravity_projects/Goal_pilot/frontend/src'):
    for f in files:
        if f.endswith('.ts') or f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # replace single quotes around the template variable with backticks
            new_content = re.sub(r"'\$\{import\.meta\.env\.VITE_API_URL \|\| 'http://localhost:5000'\}(.*?)'", r"`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}\1`", content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Fixed {path}")
