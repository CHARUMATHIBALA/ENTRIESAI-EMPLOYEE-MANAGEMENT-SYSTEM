// I HAVE BUILD A EMPLOYEE MANAGEMENT SYSTEM WHERE USER CAN SIGNUP ONCE THEN CAN LOGIN AFTER SIGNUP.
// AFTER SIGNUP IT IS REDIRECTED TO DASHBOARD PAGE WHERE WE CAN ADD EMPLOYEE DATA,EDIT DATA,DELETE DATA AS WELL AS SEARCH OUR EMPLOYEE DATA
//THE EMPLOYEE DATAS ARE NAME,EMAIL,DEPT,SALARY,JOINING DATE WHERE NAME AND EMAIL ALL MANDATORY 
//AT THE BOTTOM OF THE DASHBOARD PAGE WE HAVE THE ALL EMPLOYEE DETAILS.

// DIRECTORY STRUCTURE //
EMPLOYEE
   |backend
        |models 
            |Employee.js
            |User.js
        |routes
            |authRoutes.js
            |employeeRoutes.js
        |.env
        |server.js
    |frontend
        |src
           |components
              |App.jsx
              |main.jsx
              |style.css

//HOW TO RUN MY PROJECT
1.RUNNING BACKEND
     cd backend
     npm install(to install all dependencies)
     npm run dev
2.RUNNING FRONTEND
    cd frontend
    npm  install (to install all dependencies)
    npm run dev

              
              
