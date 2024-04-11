# Использовать официальный образ Node.js в качестве базового
FROM node:18.18.2

# Установка рабочей директории
WORKDIR /var/www/frontend

# Копирование файлов package.json и package-lock.json в рабочую директорию
COPY . /var/www/frontend/

# Nuxt server передача переменных окружения в docker-instance

ENV PORT=3000
ENV HOST=0.0.0.0

ENV NUXT_PORT=3000
ENV NUXT_HOST=0.0.0.0

# Установка зависимостей
RUN npm install 
#--legacy-peer-deps

# Копирование исходных файлов приложения в рабочую директорию
COPY . /var/www/frontend/


# Сборка приложения для production
#RUN npm run build

# Установка команды для запуска приложения
CMD [ "npm", "run" , "dev" ]

# Открытие порта для взаимодействия с приложением
EXPOSE 3000 5173

