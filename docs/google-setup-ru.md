# Синхронизация с Google Диском: как получить свой client ID

Дневник хранит записи на устройстве (localStorage). Если указать свой OAuth client ID, записи можно синхронизировать между устройствами через Google Диск. Они лежат в одном файле `diary.json` в скрытой папке приложения (appDataFolder). Дневник запрашивает только доступ `drive.appdata`: он видит лишь свою скрытую папку, а не ваши файлы на Диске.

Без client ID дневник полностью работает на одном устройстве, просто без синхронизации.

Названия пунктов меню ниже даны так, как они выглядят в английском интерфейсе Google Cloud Console (ноябрь 2026). Если консоль открывается по-русски, пункты переведены, но расположены там же.

## 1. Создайте проект

1. Откройте https://console.cloud.google.com/ и войдите в свой аккаунт Google.
2. Menu ☰ → **IAM & Admin** → **Create a Project**.
3. В поле **Project Name** введите, например, `bible-diary`. Нажмите **Create**.
4. Убедитесь, что вверху страницы выбран именно этот проект.

## 2. Включите Google Drive API

1. Menu ☰ → **APIs & services** → **Library**.
2. Найдите **Google Drive API**, откройте её и нажмите **Enable**.

## 3. Настройте экран согласия (Google Auth platform)

1. Menu ☰ → **Google Auth platform** → **Branding**.
2. Если видите «Google Auth platform not configured yet», нажмите **Get Started**.
3. **App Information**: заполните **App name** (например, «Дневник чтения Библии») и **User support email** (ваш адрес). Нажмите **Next**.
4. **Audience**: выберите **External**. Нажмите **Next**.
5. **Contact Information**: укажите **Email address**. Нажмите **Next**.
6. **Finish**: отметьте «I agree to the Google API Services: User Data Policy», нажмите **Continue**, затем **Create**.

### Добавьте себя тестовым пользователем

Приложение остаётся в статусе **Testing**, и публиковать его не нужно. Но в этом статусе войти могут только тестовые пользователи.

1. **Google Auth platform** → **Audience** → раздел **Test users** → **Add users**.
2. Введите свой адрес Gmail (и адреса тех, кто тоже будет пользоваться дневником). Нажмите **Save**.

Примечание: в статусе Testing Google может через некоторое время попросить войти заново. Дневник тогда покажет «Нужно снова войти», и достаточно нажать «Войти через Google».

### Область доступа (по желанию, но лучше указать)

1. **Google Auth platform** → **Data Access** → **Add or Remove Scopes**.
2. Найдите или впишите вручную `https://www.googleapis.com/auth/drive.appdata` (это non-sensitive scope), отметьте его, подтвердите выбор кнопкой внизу панели и нажмите **Save**.

## 4. Создайте OAuth client ID

1. **Google Auth platform** → **Clients** → **Create Client**.
2. **Application type**: **Web application**.
3. **Name**: любое, например `bible-diary-web`.
4. **Authorized JavaScript origins** → **Add URI**, добавьте адреса, с которых будет открываться дневник:
   - `https://rossh-gumngus.github.io` для сайта на GitHub Pages (https://rossh-gumngus.github.io/bible-diary/). Указывается только домен: без `/bible-diary/` и без косой черты в конце. Если вы сделали форк, укажите свой `https://<ваш-логин>.github.io`;
   - `http://localhost:8000` для проверки на своём компьютере.
5. **Authorized redirect URIs** заполнять не нужно.
6. Нажмите **Create**.
7. Скопируйте **Client ID**. Он выглядит так: `1234567890-abc...xyz.apps.googleusercontent.com`.

Client secret не нужен: дневник работает в браузере (token model Google Identity Services), секрет в файл не вставляйте.

## 5. Вставьте client ID в дневник

Вариант А — сразу в готовый файл. Откройте `index.html` в текстовом редакторе и найдите в начале основного скрипта строку:

```js
var GOOGLE_CLIENT_ID = '';
```

Впишите свой ID между кавычками:

```js
var GOOGLE_CLIENT_ID = '1234567890-abc...xyz.apps.googleusercontent.com';
```

Вариант Б — в исходниках. Сделайте ту же правку в `src/config.js` и пересоберите `index.html` (из корня репозитория):

```sh
python3 src/build.py
```

Если вписать ID только в `index.html`, следующая сборка (`python3 src/build.py`) его затрёт — поэтому для репозитория удобнее вариант Б.

Client ID — не секрет: он виден любому, кто откроет страницу. Защищает доступ список Authorized JavaScript origins.

## 6. Как открывать дневник

- **GitHub Pages**: https://rossh-gumngus.github.io/bible-diary/ (после того как новый `index.html` с вашим client ID попадёт в ветку `main`).
- **Локально**: в папке с файлом выполните
  ```sh
  python3 -m http.server 8000
  ```
  и откройте `http://localhost:8000/`.
- **Двойной щелчок по файлу (`file://…`) НЕ подойдёт**: Google не разрешает вход с таких адресов. Дневник в этом случае работает только локально и показывает подсказку.

## 7. Первый вход

1. В дневнике откройте раздел «Синхронизация с Google Диском» и нажмите «Войти через Google».
2. Google предупредит, что приложение не проверено («Google hasn’t verified this app»). Это нормально для приложения в статусе Testing: нажмите **Continue**.
3. Разрешите доступ «See, create, and delete its own configuration data in your Google Drive» (по-русски примерно «просмотр, создание и удаление собственных данных конфигурации в Google Диске»). Это и есть скрытая папка appDataFolder.
4. Записи с устройства объединятся с записями на Диске: ничего не перезаписывается, а при расхождениях побеждает более поздняя правка.

На втором устройстве откройте тот же адрес и войдите тем же аккаунтом.

## Если что-то не так

- **Ошибка 400 вида «origin_mismatch» / «redirect_uri_mismatch»**: адрес страницы не совпадает с Authorized JavaScript origins. Проверьте протокол, домен и порт. После правки клиента подождите несколько минут.
- **«Access blocked: … has not completed the Google verification process»**: ваш аккаунт не добавлен в **Test users**.
- **Окно входа не появляется**: разрешите всплывающие окна для сайта.
- Удалить данные из Диска можно так: drive.google.com → шестерёнка → **Settings** → **Manage apps** → у приложения **Options** → **Delete hidden app data** (только в веб-версии, не в мобильном приложении).
