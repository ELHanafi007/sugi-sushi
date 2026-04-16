import re

with open('src/components/StrictMenu.tsx', 'r') as f:
    content = f.read()

# Simplified tag matcher
tags = re.findall(r'<([a-zA-Z0-9\.]+)|</([a-zA-Z0-9\.]+)>', content)

stack = []
for open_tag, close_tag in tags:
    if open_tag:
        if open_tag in ['img', 'br', 'hr', 'input', 'link', 'meta']:
            continue # Simple self-closing (though in JSX they should have />)
        # Actually in JSX they MUST have /> if self-closing.
        # But our regex doesn't catch />.
        pass
    elif close_tag:
        pass

# Let's use a better regex that handles />
tags_all = re.findall(r'<([a-zA-Z0-9\.]+)[^>]*?(/?)>|((</)([a-zA-Z0-9\.]+)>)', content)

stack = []
for match in tags_all:
    # match[0] is tag name, match[1] is '/' if self-closing, match[2] is whole close tag, match[4] is close tag name
    if match[0]:
        tag_name = match[0]
        is_self_closing = match[1] == '/'
        if not is_self_closing:
            stack.append(tag_name)
    elif match[2]:
        tag_name = match[4]
        if not stack:
            print(f"Unexpected close tag: </{tag_name}>")
        else:
            last = stack.pop()
            if last != tag_name:
                print(f"Mismatch: <{last}> closed by </{tag_name}>")

if stack:
    print(f"Unclosed tags: {stack}")
else:
    print("Tags balanced (ignoring some nuances)")
