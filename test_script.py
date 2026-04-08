import re

def sanitize_for_style(value):
    if not value:
        return ""
    return re.sub(r'[<>;}\[\]"\']', '', value)

malicious_id = 'chart-id"><script>alert(1)</script>'
malicious_key = 'key;} body { background: red; }'
malicious_color = 'red;</style><script>document.body.innerHTML="<h1>XSS VULNERABILITY</h1>"</script><style>'

print("Id:", sanitize_for_style(malicious_id))
print("Key:", sanitize_for_style(malicious_key))
print("Color:", sanitize_for_style(malicious_color))
