# Тесты Bible Diary

Запуск локально (Node.js 22+):

```sh
node --test tests/*.test.cjs
```

Проверка синтаксиса:

```sh
for file in src/*.js; do node --check "$file"; done
```

Проверка сборки без изменения опубликованного `index.html`:

```sh
FONT_MODE=google OUT=/tmp/bible-diary-ci.html python3 src/build.py
```

Текущие тесты фиксируют базовое поведение планов. В следующих этапах
будут добавлены регрессионные тесты полного покрытия стихов, черновиков,
синхронизации, миграций и гибкого расписания.
