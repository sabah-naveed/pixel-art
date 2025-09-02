# Pixelfy Web App Deployment Guide

This guide covers how to deploy the Pixelfy web app to various hosting platforms.

## Local Development

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the development server:**

   ```bash
   python app.py
   ```

3. **Access the app:**
   Open your browser and go to `http://localhost:5000`

## Deployment Options

### 1. Heroku

1. **Create a `Procfile`:**

   ```
   web: gunicorn app:app
   ```

2. **Add gunicorn to requirements.txt:**

   ```
   gunicorn>=20.1.0
   ```

3. **Deploy:**
   ```bash
   heroku create your-pixelfy-app
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

### 2. Railway

1. **Connect your GitHub repository to Railway**
2. **Set environment variables:**

   - `FLASK_ENV=production`
   - `SECRET_KEY=your-secret-key`

3. **Deploy automatically from GitHub**

### 3. Render

1. **Create a new Web Service**
2. **Connect your GitHub repository**
3. **Set build command:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set start command:**
   ```bash
   gunicorn app:app
   ```

### 4. DigitalOcean App Platform

1. **Create a new app**
2. **Connect your GitHub repository**
3. **Set environment variables**
4. **Deploy**

### 5. AWS Elastic Beanstalk

1. **Install EB CLI:**

   ```bash
   pip install awsebcli
   ```

2. **Initialize EB:**

   ```bash
   eb init
   eb create pixelfy-app
   ```

3. **Deploy:**
   ```bash
   eb deploy
   ```

## Environment Variables

Set these environment variables in production:

- `SECRET_KEY`: A secure random string for Flask sessions
- `FLASK_ENV`: Set to `production` for production deployments
- `MAX_CONTENT_LENGTH`: Maximum file upload size (default: 16MB)

## File Storage

The app currently stores uploaded files locally in the `uploads/` directory. For production, consider:

1. **Cloud Storage (AWS S3, Google Cloud Storage, etc.)**
2. **Database storage for smaller files**
3. **CDN for serving processed images**

## Security Considerations

1. **File Upload Security:**

   - File type validation
   - File size limits
   - Virus scanning (optional)

2. **Rate Limiting:**

   - Implement rate limiting for uploads
   - Consider user quotas

3. **CORS:**
   - Configure CORS headers if needed
   - Restrict origins in production

## Performance Optimization

1. **Image Processing:**

   - Consider using background tasks (Celery)
   - Implement image caching
   - Use CDN for static assets

2. **Database:**

   - Add database for user management
   - Store processing history

3. **Caching:**
   - Redis for session storage
   - CDN for processed images

## Monitoring

1. **Logging:**

   - Set up proper logging
   - Monitor error rates

2. **Analytics:**
   - Track usage patterns
   - Monitor performance metrics

## Google Ads Integration

To add Google Ads to the frontend:

1. **Add Google AdSense code to `templates/index.html`:**

   ```html
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
     crossorigin="anonymous"
   ></script>
   ```

2. **Place ad units strategically:**

   - Header banner
   - Sidebar ads
   - Between sections

3. **Follow AdSense policies:**
   - No ads near upload buttons
   - Respect user experience
   - Mobile-friendly ad placement

## SSL/HTTPS

Ensure your deployment uses HTTPS:

1. **Heroku:** Automatic SSL
2. **Railway:** Automatic SSL
3. **Render:** Automatic SSL
4. **Custom domains:** Configure SSL certificates

## Backup Strategy

1. **Code:** Use Git for version control
2. **Files:** Regular backups of uploads directory
3. **Database:** Automated backups if using database
4. **Configuration:** Document all environment variables

## Scaling Considerations

1. **Horizontal Scaling:**

   - Use load balancers
   - Stateless application design

2. **Vertical Scaling:**

   - Increase server resources
   - Optimize image processing

3. **Microservices:**
   - Separate image processing service
   - API gateway for multiple services
