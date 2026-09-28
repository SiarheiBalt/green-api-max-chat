# MAX Chat (GREEN-API)

Простой веб-чат для отправки и получения **текстовых** сообщений в мессенджере [MAX](https://max.ru/) через [GREEN-API MAX](https://green-api.com/max). Интерфейс — минимальный прототип по мотивам [web.max.ru](https://web.max.ru/).

## Требования

- Node.js 18+
- Аккаунт GREEN-API и **инстанс MAX** (не WhatsApp/Telegram)
- У инстанса **пустой `webhookUrl`** — входящие обрабатываются через HTTP API (`ReceiveNotification` / `DeleteNotification`), как в [документации](https://green-api.com/v3/docs/api/receiving/technology-http-api/)
- В личном кабинете GREEN-API для инстанса должны быть **включены входящие уведомления**

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте адрес из вывода Vite (обычно `http://localhost:5173`).

### Учётные данные

На экране входа — **idInstance** и **apiTokenInstance** из личного кабинета GREEN-API.

Базовый URL API подставляется автоматически: `https://<первые 4 цифры idInstance>.api.green-api.com` (например, `310022747335` → `https://3100.api.green-api.com`). Если в кабинете другой хост — задайте `.env`: `VITE_GREEN_API_URL=https://….api.green-api.com` (см. `.env.example`).

### CORS и прокси Vite

В dev браузер ходит на свой origin; Vite проксирует `/api/<хост>/waInstance…` → `https://<хост>/waInstance…`.

Для production (`npm run build`) нужен reverse-proxy к GREEN-API или бэкенд; одного фронтенда без прокси часто недостаточно из‑за CORS.

## Сценарий использования

1. Введите **idInstance** и **apiTokenInstance** из личного кабинета GREEN-API.
2. Укажите номер телефона получателя в MAX и начните чат (формат: 11 цифр, с `7`, например `79991234567`).
3. Отправьте текстовое сообщение.
4. Когда получатель ответит в MAX, ответ появится в ленте (пока открыт этот чат и выполнен вход).

Кнопка **«Выйти»** сбрасывает сессию и чат.

## Ограничения MVP

- Только текст, один активный чат по номеру, без списка диалогов и без сохранения истории после перезагрузки страницы.
- **Входящие:** пока открыт чат, в ленту попадают все текстовые входящие (`incomingMessageReceived` + `textMessage`) с **этого инстанса**, без фильтра по `chatId`. Для теста с одним собеседником это обычно достаточно; при нескольких диалогах на одном инстансе сообщения могут смешиваться.
- Максимальная длина исходящего текста: **4000** символов (лимит SendMessage GREEN-API).

## Скрипты

| Команда        | Описание              |
|----------------|-----------------------|
| `npm run dev`  | Dev-сервер с HMR      |
| `npm run build`| Production-сборка     |
| `npm run preview` | Просмотр сборки  |

## Безопасность

Не коммитьте и не публикуйте **apiTokenInstance**. Учётные данные хранятся только в памяти вкладки и сбрасываются при выходе.

## Стек

React, TypeScript, Vite, контексты Session + Chat, GREEN-API v3 (SendMessage, ReceiveNotification, DeleteNotification).
