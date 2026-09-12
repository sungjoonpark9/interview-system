Bilingual Demo v4
=================
Principle:
- Original Korean application logic is preserved exactly.
- English is added only as a display-layer script.
- Korean mode therefore uses the original source UI/behavior.
- Language choice is saved in localStorage.
- The same language is applied to iframe screens after reload.

Recommended test:
1. Open collect-assign-system/app.html
2. Confirm Korean UI first.
3. Sign in as each demo role and confirm role-specific bottom navigation and Sign Out.
4. Switch to English.
5. Repeat role/navigation checks.
6. Switch back to Korean and confirm the original Korean UI is restored.

This v4 intentionally avoids modifying the core session, navigation, routing, or role logic.
