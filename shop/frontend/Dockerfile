FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from the build stage
COPY dist /app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
