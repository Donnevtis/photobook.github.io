# Photobank

```
Демо приложения для храниния медиафайлов.

Ключевой особенностью является вывод meta-данных о фотографиях, если таковая имеется.
Работает редактор аватарки.
Работает ассинхронная загрузка файлов из базы данных.
Работает аутентификация и авторизация.
Серверный рендеринг.

Стек:
  -Node.js;
  -шаблонизатор Pug;
  -библиотека для аутентификации Passport.js
  -база данных MongoDB (Atlas) и библиотека Mongoose;
  -библиотека sharp для обработкаи фото;
  -сборка WebPack + Babel
 
```

## Project setup

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

Требуется время для развертывания при первом запуске:
https://photobanks.herokuapp.com/
