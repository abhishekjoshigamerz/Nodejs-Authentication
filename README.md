# Nodejs-Authentication
Node js authentication application. This app is a custom build node js authentication applications.


#Features of this application are : 

1. Google oauth login / sign up feature

2. Password is stored in bcrypt encryption 

3. Reset feature for password from 2 ways. One for logined user and one for user who is not login via email

4.Displays alerts for user when they sign in logout

5. google recaptcha v2 is enabled for login sign up page.


#How to install this application

1. Use npm install or yarn command to install all dependencies. 

2. Make a .env file. You will be needing different parameters to be stored there 

3.  For sending emails using gmail you will need any email id whose password you have 
    EMAIL = 'email address @ gmail.com'
    PASSWORD = '****'

    Please note that this password you will need to enabled 2FA in your gmail account and then make a app which will provide you password for it. 
    Don't store the password in other pages. use .env file for it. 

4. For google authentication to work you will need to 
    googleClientSecret=***** 
    googleClientId=*******
    
    this will store your client secret go to google console and you will be getting new credentials there. that will alos provide you the Client Id

    


    googleOAuthRedirect=http://localhost:3000/sessions/oauth/google
    googleOAuthPublicEndPoint=http://localhost:3000

    Don't change this 2 above urls. Only change when you are putting your server on production. Also note that google oauth will work for SSL secrured sites only. 

5. For enabling google recaptcha go to google recaptcha site and click google admin. 

6. Select your version and select invisible google recaptcha which this projecgt is using . you will get the key from there. 

7. replace that key with your key in signin.ejs and home.ejs pages in data-sitekey in button pages.